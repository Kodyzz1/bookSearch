import { getDirname } from './dirname';

const __dirname = getDirname(import.meta.url);

console.log(__dirname); // This will log the directory name of the current module
