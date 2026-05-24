const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\c54c7328-595f-45e6-bd4b-b2949396f520\\.system_generated\\logs\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let userMsgIndex = 1;
rl.on('line', (line) => {
  try {
    const step = JSON.parse(line);
    if (step.type === 'USER_INPUT') {
      console.log(`--- USER INPUT ${userMsgIndex++} (${step.created_at}) ---`);
      
      // Extract the prompt from content if formatted as <USER_REQUEST>...
      let content = step.content;
      const requestMatch = content.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/i);
      if (requestMatch) {
        content = requestMatch[1].trim();
      }
      console.log(content);
      console.log('\n');
    }
  } catch (err) {
    // Ignore invalid JSON lines (e.g. if truncated/corrupted, though transcript.jsonl should be valid)
  }
});
