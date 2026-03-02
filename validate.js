import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const ajv = new Ajv();

function validate() {
  const dataPath = path.resolve('public/data/nodes.json');
  if (!fs.existsSync(dataPath)) {
    console.log('nodes.json not found, assuming build is running before data migration.');
    return;
  }
  const fileContent = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const data = fileContent.nodes || fileContent;

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      required: ['id', 'name', 'type', 'construction'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        type: { enum: ['class', 'operation', 'number'] },
        description: { type: 'string' },
        construction: {
          type: 'object',
          required: ['method'],
          properties: {
            method: { enum: ['primitive_steps', 'composition'] },
            steps: { type: 'array', items: { type: 'string' } },
            operation: { type: 'string' },
            arguments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['role', 'source'],
                properties: {
                  role: { type: 'string' },
                  source: { type: 'string' },
                  value: { type: 'string' },
                  justification: { type: 'string' },
                  dependencies: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          },
          additionalProperties: false
        },
        proofDoc: { type: ['string', 'null'] }
      },
      additionalProperties: false
    }
  };
  const validateSchema = ajv.compile(schema);
  const ok = validateSchema(data);
  if (!ok) {
    console.error('Validation errors:', JSON.stringify(validateSchema.errors, null, 2));
    process.exit(1);
  }

  // Cross-validation for composition arguments -> source DAG references
  const validIds = new Set(data.map(node => node.id));
  const errors = [];
  data.forEach(node => {
    if (node.construction && node.construction.method === 'composition' && node.construction.arguments) {
      node.construction.arguments.forEach(arg => {
        if (arg.source && !validIds.has(arg.source)) {
          errors.push(`Node '${node.id}' references non-existent source: '${arg.source}'`);
        }
        if (arg.dependencies) {
          arg.dependencies.forEach(dep => {
            if (!validIds.has(dep)) {
              errors.push(`Node '${node.id}' has dependency referencing non-existent node: '${dep}'`);
            }
          });
        }
      });
    }
  });

  if (errors.length > 0) {
    console.error('DAG Validation Errors:', errors);
    process.exit(1);
  }

  console.log('nodes.json schema and DAG topology validated.');
}

validate();
console.log('build pre-check complete');
