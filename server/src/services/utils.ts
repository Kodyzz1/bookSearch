import { getDirname } from './dirname.js';

const __dirname = getDirname(import.meta.url);

console.log(__dirname); // This will log the directory name of the current module
