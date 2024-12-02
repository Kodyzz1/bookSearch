import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Function to get the directory name
export function getDirname(metaUrl: string): string {
  const __filename = fileURLToPath(metaUrl);
  return dirname(__filename);
}

