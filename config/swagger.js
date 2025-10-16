// config/swagger.js
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const yamlPath = path.resolve(__dirname, '../swagger.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

export { swaggerUi, swaggerDocument };