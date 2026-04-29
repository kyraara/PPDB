const fs = require('fs');
const path = require('path');

const directory = 'd:\\laragon\\www\\PPDB\\frontend\\src';

const replacements = {
  'var(--jenjang-tk)': 'var(--accent-primary)',
  'var(--jenjang-smp)': 'var(--accent-primary)',
  'var(--jenjang-sd)': 'var(--accent-primary-light)',
  'var(--jenjang-sma)': 'var(--accent-primary-light)',
  'var(--accent-gold)': 'var(--accent-primary)',
  'var(--accent-gold-light)': 'var(--accent-primary-light)',
  'var(--accent-gold-dark)': 'var(--accent-primary-hover)',
  'var(--accent-emerald)': 'var(--accent-primary-light)',
  'var(--accent-emerald-light)': 'var(--accent-primary-light)',
  'var(--accent-emerald-dark)': 'var(--accent-primary)',
  'btn-emerald': 'btn-primary',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(directory);
let totalReplaced = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const [oldStr, newStr] of Object.entries(replacements)) {
    content = content.split(oldStr).join(newStr);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplaced++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nFinished! Updated ${totalReplaced} files.`);
