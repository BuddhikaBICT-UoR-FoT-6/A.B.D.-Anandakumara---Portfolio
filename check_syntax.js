const fs = require('fs');
const path = require('path');
const vm = require('vm');

try {
  const filePath = path.resolve(__dirname, 'admin.html');
  console.log('Reading:', filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const scriptRegex = /<script>([\s\S]*?)<\/script>/i;
  const match = content.match(scriptRegex);
  
  if (!match) {
    console.error('No <script> tag found in admin.html!');
    process.exit(1);
  }
  
  const code = match[1];
  console.log('Found script of length:', code.length);
  
  // Try to parse the JS
  new vm.Script(code);
  console.log('Script parsed successfully! No syntax errors.');
} catch (err) {
  console.error('Syntax error detected:');
  console.error(err);
  process.exit(1);
}
