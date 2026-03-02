// simple build script: validate nodes.json and copy files to docs/
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv();

function validate() {
  const data = JSON.parse(fs.readFileSync('data/nodes.json', 'utf-8'));
  const schema = {
    type: 'array',
    items: {
      type: 'object',
      required: ['id','name','type','outputType','engine','proofDoc'],
      properties: {
        id: {type:'string'},
        name:{type:'string'},
        type:{type:'string'},
        inputs:{type:'array'},
        outputType:{type:'string'},
        engine:{type:'string'},
        rounding:{type:'string'},
        description:{type:'string'},
        proofDoc:{type:'string'}
      },
      additionalProperties: false
    }
  };
  const validate = ajv.compile(schema);
  const ok = validate(data);
  if (!ok) {
    console.error('Validation errors:', validate.errors);
    process.exit(1);
  }
  console.log('nodes.json validated');
}

function copyFiles() {
  const src = 'src';
  const dest = 'docs';
  // Just create dest, don't try to delete (avoids permission issues on Windows)
  fs.mkdirSync(dest, { recursive: true });
  // copy recursively, overwriting files as needed
  const copyDir = (s, d) => {
    fs.mkdirSync(d, { recursive: true });
    for (const entry of fs.readdirSync(s, { withFileTypes: true })) {
      const srcPath = path.join(s, entry.name);
      const dstPath = path.join(d, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, dstPath);
      } else {
        // Try to remove dest file first if it exists
        try {
          if (fs.existsSync(dstPath)) fs.unlinkSync(dstPath);
        } catch (e) {
          // Ignore errors from unlock
        }
        fs.copyFileSync(srcPath, dstPath);
      }
    }
  };
  copyDir(src, dest);
  // copy additional data files
  const nodes = fs.readFileSync('data/nodes.json');
  fs.writeFileSync(path.join(dest, 'api_nodes.json'), nodes);
  const engines = fs.readFileSync('data/engines.json');
  fs.writeFileSync(path.join(dest, 'data_engines.json'), engines);
}

validate();
copyFiles();
console.log('build complete');
