const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const allCodeFiles = getFiles('app').concat(getFiles('components'));
const uiPath = 'components/ui';
const uiFiles = fs.readdirSync(uiPath).filter(f => f.endsWith('.tsx'));

const fileContents = allCodeFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

let deleted = 0;
uiFiles.forEach(file => {
  const componentName = file.replace('.tsx', '');
  // See if components/ui/NAME is anywhere inside the source files
  const regexPath = `components/ui/${componentName}`;
  const regexA = new RegExp(regexPath, 'i');
  const regexB = new RegExp(`@/components/ui/${componentName}`, 'i');
  const regexC = new RegExp(`ui/${componentName}`, 'i');
  
  if (!regexC.test(fileContents)) {
     fs.unlinkSync(path.join(uiPath, file));
     console.log('Deleted ' + file);
     deleted++;
  }
});
console.log('Total UI components deleted: ' + deleted);
