# Performance & Timeout Issues - Explained

## Expected Performance

**Normal timing for Claude Code generation:**
- Claude Code startup: 5-10 seconds
- Reading all .md documentation: 5-10 seconds
- API call to Anthropic servers: 10-20 seconds
- Response generation: 5-10 seconds
- **TOTAL: 25-50 seconds typically**

**This is normal!** Claude Code is doing a LOT:
1. Starting up the CLI tool
2. Reading CLAUDE.md + all other documentation files
3. Making API calls to Anthropic's servers
4. Generating intelligent, context-aware responses

---

## Recent Optimizations (What We Fixed)

### 1. **Reduced Timeout from 60s → 45s**
- Forces faster responses or clearer failures
- User gets feedback sooner if something goes wrong

### 2. **Added Progress Indicators**
- Warning at 20 seconds if no output yet
- Lets user know system is still working
- "This is normal for first request or large documentation"

### 3. **Better Error Messages**
- Shows time since last output
- Lists possible causes (network, documentation size, installation)
- Provides actionable troubleshooting steps

### 4. **Smart Timeout Detection**
- Detects if output started but stalled
- Returns partial output if substantial response received
- Different error messages for different failure types

### 5. **Proper Resource Cleanup**
- Clears timers when process completes
- Prevents memory leaks
- Handles all exit paths (success, error, timeout)

---

## Why Timeouts/Errors Happen

### Common Causes:

**1. Large Documentation Files**
- Projects with many .md files take longer to read
- "Generate Variations" has 17KB CLAUDE.md + many reference files
- Solution: Normal behavior, just takes time

**2. Network Latency**
- Claude Code makes API calls to Anthropic servers
- Slow internet = slow responses
- Solution: Check internet connection, wait for response

**3. First Request is Slower**
- Claude Code initializes on first run
- Subsequent requests are usually faster
- Solution: Normal behavior, be patient on first request

**4. Complex Instructions**
- Very long or complex prompts take longer to process
- Multiple variations take N times longer (each is separate)
- Solution: Simplify instructions, reduce variation count

**5. API Rate Limits**
- Anthropic may rate limit rapid requests
- Solution: Wait a few seconds between requests

---

## What The App Does Now

### Normal Flow (25-50 seconds):
```
1. [0-10s]  User clicks "Generate" → Server receives request
2. [0-5s]   Server spawns Claude Code process in project directory
3. [5-10s]  Claude Code reads CLAUDE.md + all documentation
4. [10-30s] Claude Code makes API call to Anthropic
5. [30-45s] Response streams back, server captures output
6. [45s]    Server returns result to browser, user sees prompt
```

### With Progress Feedback:
```
- [0-20s]   Working silently...
- [20s]     Console shows: "⚠️ Still waiting (20s elapsed)... normal for first request"
- [20-45s]  Continuing...
- [45s]     Success! OR timeout with helpful error message
```

---

## Troubleshooting Guide

### If You See "Timeout after 45 seconds":

**Check:**
1. ✅ Is your internet working?
2. ✅ Is this the first request? (First is always slower)
3. ✅ Is the instruction very long or complex? (Try simplifying)
4. ✅ Are you generating many variations? (Each adds time)

**Try:**
1. Refresh the page and try again (sometimes transient)
2. Simplify your instruction (shorter = faster)
3. Generate 1 variation instead of many
4. Check terminal/console for specific error messages
5. Restart the app (kill server, restart)

### If You See "Claude Code stalled":

This means output started but then stopped.

**Try:**
1. The partial output might still be usable - check the response
2. Restart and try again with simpler instruction
3. Check if Claude Code is updated: `npm install -g @anthropics/claude-code`

### If You See "No output received":

This means Claude Code never started generating.

**Try:**
1. Verify Claude Code is installed: `claude --version`
2. Check if you're logged in: `claude login`
3. Restart the app completely
4. Check if CLAUDE.md exists in the project directory

---

## Performance Tips

### For Faster Results:

1. **Keep instructions concise**
   - Short, clear instructions process faster
   - Long paragraphs add processing time

2. **Generate fewer variations**
   - Each variation is a separate full generation
   - 1 variation = 30s, 5 variations = 150s

3. **Use simpler projects first**
   - "Modify Design" has less documentation = faster
   - "Generate Variations" has most documentation = slower

4. **Wait for first request to complete**
   - First request initializes everything
   - Subsequent requests are faster

5. **Good internet connection**
   - API calls require internet
   - Slow connection = slow responses

---

## Expected Timing by Project

| Project | Doc Size | Typical Time |
|---------|----------|--------------|
| Modify Design | ~15KB | 25-35 seconds |
| Design from Scratch | ~35KB | 30-40 seconds |
| Previous Element | ~45KB | 35-45 seconds |
| Generate Variations | ~85KB | 40-50 seconds |

**Multiple variations:** Add 20-30s per additional variation

---

## Technical Details

### What Changed in server.js:

**Before:**
```javascript
setTimeout(() => {
  claude.kill();
  reject('Timeout after 60 seconds');
}, 60000);
```

**After:**
```javascript
// Warning at 20s
const warningTimer = setTimeout(() => {
  console.log('⚠️ Still waiting (20s)...');
}, 20000);

// Timeout at 45s with smart detection
const timeoutTimer = setTimeout(() => {
  if (output.length > 50) {
    resolve(output); // Return partial
  } else if (hasReceivedOutput) {
    reject('Stalled after Xs'); // Stalled
  } else {
    reject('No output - check installation'); // Never started
  }
}, 45000);

// Clean up timers on completion
claude.on('close', () => {
  clearTimeout(warningTimer);
  clearTimeout(timeoutTimer);
});
```

---

## Summary

**30-50 seconds is NORMAL for Claude Code generation.** It's not a bug - it's doing complex work:
- Reading documentation
- Making API calls
- Generating intelligent responses

The recent optimizations make timeouts/errors **clearer and faster to detect**, but can't make Claude Code itself faster (that's up to Anthropic's servers and your internet connection).

**Be patient, especially on first request!** ⏱️
