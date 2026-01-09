const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { spawn, exec } = require('child_process');
const app = express();
const PORT = 3001;

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Project configurations with folder mappings
const PROJECTS = {
  'variations': {
    name: 'Generate Variations from an Existing Design',
    color: '#4A90E2',
    icon: '🎨',
    folder: '../Generate Variations from an Existing Design'
  },
  'from-scratch': {
    name: 'Design from Scratch',
    color: '#7B68EE',
    icon: '✨',
    folder: '../Design from Scratch'
  },
  'previous-element': {
    name: 'Design Based on a Previous Element',
    color: '#50C878',
    icon: '🔄',
    folder: '../Design Based on a Previous Element'
  },
  'modify': {
    name: 'Modify Existing Design',
    color: '#FF6B6B',
    icon: '🔧',
    folder: '../MODIFY_DESIGN'
  }
};

// Function to invoke Claude Code in the project directory
async function invokeClaude(projectType, instruction, params) {
  return new Promise(async (resolve, reject) => {
    const project = PROJECTS[projectType];
    if (!project) {
      reject(new Error('Invalid project type'));
      return;
    }

    const projectPath = path.join(__dirname, project.folder);

    // Copy images to project directory if provided (Claude Code can only access files in its working directory)
    let projectImages = [];
    if (params.images && params.images.length > 0) {
      try {
        for (const imagePath of params.images) {
          const filename = path.basename(imagePath);
          const destPath = path.join(projectPath, filename);
          await fs.copyFile(imagePath, destPath);
          projectImages.push(destPath);
          console.log(`📁 Copied image to project: ${filename}`);
        }
      } catch (error) {
        console.error('❌ Error copying images:', error);
        reject(new Error(`Failed to copy images to project directory: ${error.message}`));
        return;
      }
    }

    // Build the full instruction with parameters
    let fullInstruction = instruction;

    // Add context based on parameters
    if (params.destination) {
      fullInstruction += `\n\nDestination: ${params.destination}`;
    }
    if (params.theme) {
      fullInstruction += `\nTheme: ${params.theme}`;
    }
    // Only include Transformeter for 'variations' project type
    if (params.level && params.projectType === 'variations') {
      fullInstruction += `\n\n**MANDATORY TRANSFORMETER LEVEL: ${params.level}/10** - You MUST use exactly this transformation level in your output. Do not default to any other value.`;
    }
    // Only include Decoration Level for 'variations' project type (the only one with that slider)
    if (params.decorationLevel && params.projectType === 'variations') {
      fullInstruction += `\n**MANDATORY DECORATION LEVEL: ${params.decorationLevel}/10** - You MUST use exactly this decoration level in your output. Do not default to 8/10 or any other value.`;
    }
    // Only include Crazymeter for 'from-scratch' and 'previous-element' project types
    if (params.crazymeter && (params.projectType === 'from-scratch' || params.projectType === 'previous-element')) {
      fullInstruction += `\n\n**MANDATORY CRAZYMETER LEVEL: ${params.crazymeter}/10** - This controls how creative/unconventional the design should be:
  - 1-3: Traditional, safe, expected design concepts
  - 4-6: Balanced creativity with unique twists
  - 7-10: Wild, unexpected, boundary-pushing ideas
You MUST use exactly this creativity level. A level of ${params.crazymeter}/10 means ${params.crazymeter <= 3 ? 'keep designs traditional and safe' : params.crazymeter <= 6 ? 'add creative twists while staying grounded' : 'push boundaries with wild, unconventional ideas'}.`;
    }
    if (params.style) {
      const styleNames = {
        'cartoon': 'Cartoon - Playful cartoon style with bold outlines and vibrant colors',
        'realistic': 'Realistic - Detailed realistic illustration with natural colors and textures',
        'collage': 'Collage - CRITICAL: Create a true mixed media COLLAGE design with these specific requirements:\n  • Use layered cutout style with visible edges and overlapping elements\n  • Include varied textures (paper, fabric, photo fragments, patterns)\n  • Mix different art styles and media types (photos, illustrations, patterns, text)\n  • Create depth through overlapping layers with shadows/highlights\n  • Use irregular torn/cut edges on elements (NOT perfect vector shapes)\n  • Include decorative elements like tape, borders, stamps, or stitching effects\n  • Intentional composition that looks hand-assembled from multiple sources\n  • This should look like physical collage art, NOT a regular illustration',
        'photography': 'Photography - Photography-based design with real photo elements integrated into the composition. Combine real photography with illustrated elements, decorative frames, or use photos as texture fills for regional shapes.'
      };
      fullInstruction += `\nStyle: ${styleNames[params.style] || params.style}`;
    }
    if (params.ratio) {
      const ratioFormats = {
        '1:1': 'Square 1:1',
        '2:1': 'Rectangular 2:1 (horizontal landscape)'
      };
      fullInstruction += `\nFormat/Ratio: ${ratioFormats[params.ratio] || params.ratio}`;
    }
    if (params.productType) {
      fullInstruction += `\nProduct Type: ${params.productType}`;

      // Add shape constraints if this is a bottle opener AND user has uploaded shape references
      if (params.productType === 'bottle-opener' && params.images && params.images.length > 0) {
        fullInstruction += `\n\nMANDATORY BOTTLE OPENER SHAPE (CRITICAL - NON-NEGOTIABLE):

EXACT SHAPE REQUIREMENTS - Study the reference images carefully:
• TOP SECTION: Large rounded opening (upside-down U or rounded rectangle) where bottle cap fits - this opening is ESSENTIAL and must be clearly visible
• OVERALL PROPORTIONS: Tall vertical format, approximately 6" height x 3" width ratio
• MIDDLE SECTION: Narrower "neck" area (2-2.5" wide) with gentle organic curves on sides
• BOTTOM SECTION: Wider rounded base (3.5-4" wide, occupying 35-40% of height) for stability
• ALL EDGES: Organic flowing curves following design elements - NO straight lines or hard corners
• STRUCTURAL INTEGRITY: All decorative elements connect to main composition, no floating parts

The reference images show EXACTLY how this should look. Your design MUST match this silhouette - it's a functional product, not a decorative rectangle or circle. The top opening and bottom base widening are the defining features that make this recognizable as a bottle opener.

VISUAL CHECK: If someone saw just the outline/silhouette, would they recognize it as a bottle opener? If not, fix the shape.`;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎨 INVOKING CLAUDE CODE`);
    console.log(`Project: ${project.name}`);
    console.log(`Directory: ${projectPath}`);
    console.log(`Instruction: ${fullInstruction.substring(0, 200)}...`);
    if (projectImages.length > 0) {
      console.log(`Images: ${projectImages.length} file(s) (copied to project directory)`);
      projectImages.forEach((img, i) => {
        console.log(`  [${i + 1}] ${path.basename(img)}`);
      });
    }
    console.log(`${'='.repeat(60)}\n`);

    let output = '';
    let errorOutput = '';
    let lastOutputTime = Date.now();
    let hasReceivedOutput = false;

    // Add image file reading instruction if images are provided
    if (projectImages.length > 0) {
      const imageFilenames = projectImages.map(img => path.basename(img));
      fullInstruction = `FIRST: Use the Read tool to read these image file(s) in the current directory:\n${imageFilenames.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nTHEN: ${fullInstruction}`;

      // Special handling for "Design Based on Previous Element" with photography
      if (projectType === 'previous-element' && params.style === 'photography' && params.photoStyle) {
        const approachInstructions = {
          'clipping-mask': `
MANDATORY APPROACH - CLIPPING MASK:
Create a design where the photograph is placed INSIDE a regional iconic shape (animal silhouette, cultural object, landmark silhouette, etc.). The photo becomes the texture/fill of this shape.

SPECIFIC REQUIREMENTS:
- Choose an iconic shape related to the destination (e.g., deer, coyote, saguaro, bird, building silhouette)
- The photograph should fill the ENTIRE interior of this shape
- Add minimal decorative elements around the shape (not inside it)
- Text should be integrated into the illustrated border/decorative elements, NOT overlaid on the photo
- The clipping mask shape should be bold and recognizable
- Style: Bold cartoon-style outline for the shape, clean clipping mask effect`,

          'decorative-frame': `
MANDATORY APPROACH - DECORATIVE FRAME:
Create a design where the photograph is centered in an ornamental frame/window, surrounded by illustrated cartoon-style regional elements.

SPECIFIC REQUIREMENTS:
- Place the photo in the center (30-40% of total composition)
- Create an ornamental frame around it (geometric pattern, organic vines, or architectural elements)
- Surround with illustrated regional elements: flora, fauna, cultural icons, food, landmarks
- These elements should be CARTOON STYLE with thick outlines and vibrant colors
- Text should be integrated into the decorative border layer
- The decorative elements should interact with the frame, not just float randomly
- Create depth and layering between frame, photo, and decorative elements`
        };

        fullInstruction += `\n\nIMPORTANT: After reading the image(s), determine if they are REAL PHOTOGRAPHS (not illustrations/designs). If they are photographs, you MUST create an illustrated design using this approach:

${approachInstructions[params.photoStyle]}

KEY REQUIREMENTS:
- Extract regional/cultural elements from the destination and instructions
- Use decoration level ${params.decorationLevel}/10 to control density of decorative elements
- The photo should be ONE ELEMENT in a larger illustrated composition
- DO NOT just add white text on top of the photo - that's lazy and unacceptable
- Create a detailed, specific prompt that clearly describes how the photo integrates with illustrated elements`;
      }
    }

    // Use echo piping for instruction (Claude Code will read images from working directory)
    const command = `echo ${JSON.stringify(fullInstruction)} | claude`;

    // Spawn process using shell to allow piping
    const claude = spawn(command, [], {
      cwd: projectPath,
      shell: true,
      env: { ...process.env }
    });

    // Early warning timer (20 seconds)
    const warningTimer = setTimeout(() => {
      if (!hasReceivedOutput) {
        console.log('⚠️  Still waiting for Claude Code response (20s elapsed)... This is normal for first request or large documentation.');
      }
    }, 20000);

    // Timeout after 120 seconds (increased for projects with heavy documentation)
    const timeoutTimer = setTimeout(async () => {
      clearTimeout(warningTimer); // Clean up warning timer
      claude.kill();
      await cleanupImages(); // Clean up copied images

      const timeSinceLastOutput = Date.now() - lastOutputTime;

      if (output && output.length > 50) {
        console.log('⚠️  Timeout reached, returning partial output');
        resolve(output);
      } else if (hasReceivedOutput) {
        reject(new Error(`Claude Code stalled after ${Math.round(timeSinceLastOutput/1000)}s with no new output. The generation may be incomplete.`));
      } else {
        reject(new Error('Claude Code timed out after 120 seconds with no output. Possible causes:\n• Large documentation files taking too long to read\n• Network latency to Anthropic API\n• Claude Code not properly installed\n\nTry: Simplify instruction, check internet connection, or restart the app.'));
      }
    }, 120000);

    // Capture stdout
    claude.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      lastOutputTime = Date.now();
      hasReceivedOutput = true;
      clearTimeout(warningTimer); // Clear warning once we get output
      console.log(text);
    });

    // Capture stderr
    claude.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error('stderr:', text);
    });

    // Cleanup function to delete copied images
    const cleanupImages = async () => {
      for (const imgPath of projectImages) {
        try {
          await fs.unlink(imgPath);
          console.log(`🗑️  Deleted temporary image: ${path.basename(imgPath)}`);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };

    // Handle completion
    claude.on('close', async (code) => {
      clearTimeout(warningTimer); // Clean up warning timer
      clearTimeout(timeoutTimer); // Clean up timeout timer
      console.log(`\n✓ Claude process completed (exit code: ${code})\n`);

      // Clean up copied images
      await cleanupImages();

      // Filter out Claude's greeting messages - we only want the actual response
      let filteredOutput = output;

      // Remove greeting and help text
      const greetingMarkers = [
        'Hello! I\'m Claude',
        'How can I help you today',
        'I can assist with:',
        'What would you like to work on?'
      ];

      // Find where the actual response starts (after all the greeting)
      let responseStart = 0;
      for (const marker of greetingMarkers) {
        const index = output.lastIndexOf(marker);
        if (index > responseStart) {
          responseStart = index;
        }
      }

      // Find the start of actual content after the greeting
      if (responseStart > 0) {
        // Look for the next substantial content after greetings
        const afterGreeting = output.substring(responseStart);
        const nextNewline = afterGreeting.indexOf('\n\n');
        if (nextNewline > 0) {
          filteredOutput = output.substring(responseStart + nextNewline).trim();
        }
      }

      if (filteredOutput && filteredOutput.length > 100) {
        resolve(filteredOutput);
      } else if (output && output.length > 100) {
        // Fallback to full output if filtering didn't work
        resolve(output);
      } else {
        reject(new Error(`Claude Code failed to generate output: ${errorOutput || 'No substantial output received'}`));
      }
    });

    // Handle errors
    claude.on('error', async (error) => {
      clearTimeout(warningTimer); // Clean up timers
      clearTimeout(timeoutTimer);
      await cleanupImages(); // Clean up copied images
      console.error('Failed to start Claude Code:', error);
      reject(new Error(`Failed to start Claude Code: ${error.message}. Make sure Claude Code is installed and the 'claude' command is available.`));
    });
  });
}

// Generate multiple variations using Claude Code with streaming callback
async function generateVariations(params, count, onVariationComplete) {
  const { projectType, instructions } = params;
  const variations = [];

  console.log(`\n${'*'.repeat(60)}`);
  console.log(`GENERATING ${count} VARIATION(S) USING CLAUDE CODE`);
  console.log(`${'*'.repeat(60)}\n`);

  for (let i = 0; i < count; i++) {
    try {
      // Modify instruction for each variation to get different results
      let modifiedInstruction = instructions;
      const hasImages = params.images && params.images.length > 0;

      // Always emphasize reference usage if images are provided
      if (hasImages && count === 1) {
        modifiedInstruction = `${instructions}\n\nCRITICAL: You MUST create a variation based on the reference image(s) provided above. Keep the CORE ELEMENTS, CHARACTER, and OVERALL COMPOSITION from the reference design. Apply the modifications requested while maintaining the recognizable elements from the reference. DO NOT create a completely new design from scratch.`;
      } else if (count > 1) {
        // If images are provided, emphasize that this is a VARIATION of the reference
        if (hasImages) {
          modifiedInstruction = `${instructions}\n\nCRITICAL: This is variation ${i + 1} of ${count}. You MUST create a variation based on the reference image(s) provided above. Keep the CORE ELEMENTS, CHARACTER, and OVERALL COMPOSITION from the reference, while applying the modifications requested. Be creative and innovative with your approach. DO NOT create a completely different design - this should be recognizably a variation of the reference with the modifications requested.`;
        } else {
          modifiedInstruction = `${instructions}\n\nIMPORTANT: Create variation ${i + 1} of ${count}. Be completely innovative and creative with your approach. Make it DIFFERENT from other variations.`;
        }
      }

      console.log(`\n[${'='.repeat(10)} VARIATION ${i + 1}/${count} ${'='.repeat(10)}]\n`);

      // Invoke Claude Code - this will read all the project documentation
      const output = await invokeClaude(projectType, modifiedInstruction, params);

      const variation = {
        title: `Variation ${i + 1}`,
        prompt: output,
        index: i
      };

      variations.push(variation);
      console.log(`\n✅ Variation ${i + 1} completed successfully\n`);

      // Call the callback immediately when this variation is ready
      if (onVariationComplete) {
        onVariationComplete(variation, i, count);
      }

    } catch (error) {
      console.error(`❌ Error generating variation ${i + 1}:`, error.message);
      const errorVariation = {
        title: `Variation ${i + 1} - Error`,
        prompt: `❌ Error generating prompt:\n\n${error.message}\n\n**Troubleshooting:**\n- Make sure Claude Code is installed (npm install -g @anthropics/claude-code)\n- Ensure the 'claude' command is available in your terminal\n- Check that you're in the correct directory\n- Verify the project documentation exists in: ${PROJECTS[projectType]?.folder}`,
        index: i
      };

      variations.push(errorVariation);

      // Call callback for error variations too
      if (onVariationComplete) {
        onVariationComplete(errorVariation, i, count);
      }
    }
  }

  console.log(`\n${'*'.repeat(60)}`);
  console.log(`COMPLETED ${variations.length} VARIATIONS`);
  console.log(`${'*'.repeat(60)}\n`);

  return variations;
}

// API Endpoints

// Server-Sent Events endpoint for streaming variations as they complete
app.post('/api/generate-prompt-stream', upload.array('images'), async (req, res) => {
  try {
    const { projectType, instructions, variationCount, destination, theme, level, decorationLevel, crazymeter, style, ratio, productType, includeShapeConstraints, photoStyle } = req.body;
    const images = req.files || [];
    const count = parseInt(variationCount) || 1;

    if (!instructions || !instructions.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Instructions are required'
      });
    }

    if (!projectType || !PROJECTS[projectType]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project type'
      });
    }

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Map uploaded images (now includes user-selected shape references)
    const allImages = images.map(img => path.join(__dirname, 'uploads', path.basename(img.path)));

    const params = {
      projectType,
      instructions,
      destination,
      theme,
      level: level || 5,
      decorationLevel: decorationLevel || 8,
      crazymeter: crazymeter || null,
      style: style || '',
      ratio: ratio || '1:1',
      productType: productType || 'bottle-opener',
      includeShapeConstraints: includeShapeConstraints === 'true',
      photoStyle: photoStyle || null,
      images: allImages
    };

    console.log('\n📥 Received streaming request:', {
      project: PROJECTS[projectType].name,
      variations: count,
      hasImages: images.length > 0,
      imageFiles: images.map(img => img.filename),
      level: params.level,
      decorationLevel: params.decorationLevel,
      crazymeter: params.crazymeter
    });

    // Send initial message
    res.write(`data: ${JSON.stringify({ type: 'start', total: count })}\n\n`);

    // Generate variations with streaming callback
    generateVariations(params, count, (variation, index, total) => {
      // Send variation immediately when ready
      res.write(`data: ${JSON.stringify({
        type: 'variation',
        variation: variation,
        index: index,
        total: total
      })}\n\n`);
    }).then(() => {
      // Send completion message
      res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
      res.end();
    }).catch((error) => {
      // Send error message
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error('❌ Error in streaming endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get project info
app.get('/api/projects', (req, res) => {
  const projectsInfo = {};
  for (const [key, value] of Object.entries(PROJECTS)) {
    projectsInfo[key] = {
      name: value.name,
      color: value.color,
      icon: value.icon
    };
  }
  res.json(projectsInfo);
});

// Function to open Chrome browser
function openChrome(url) {
  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    // macOS
    command = `open -a "Google Chrome" "${url}"`;
  } else if (platform === 'win32') {
    // Windows
    command = `start chrome "${url}"`;
  } else {
    // Linux
    command = `google-chrome "${url}" || chromium-browser "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.log(`⚠️  Could not auto-open Chrome: ${error.message}`);
      console.log(`💡 Please manually open: ${url}`);
    } else {
      console.log(`🌐 Opened Chrome at ${url}`);
    }
  });
}

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🎨 Design Prompt Generator - RUNNING! 🎨           ║
║                                                            ║
║        Open your browser and go to:                        ║
║                                                            ║
║        👉  http://localhost:${PORT}                          ║
║                                                            ║
║        ⚡ Now powered by Claude Code!                      ║
║        📚 Reads your project documentation automatically   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
  console.log('\n✅ Server ready! Waiting for requests...\n');

  // Auto-open Chrome after a brief delay to ensure server is ready
  setTimeout(() => openChrome(url), 1000);
});
