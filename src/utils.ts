const fs = require('fs');

export function getPkg() {
  const pkg = fs.readFileSync('package.json');
  return JSON.parse(pkg);
}
