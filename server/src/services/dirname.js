// server/src/services/dirname.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Gets the directory name of the current module.
 *
 * @param {string} metaUrl - The value of import.meta.url
 * @returns {string} The directory name of the current module.
 */
export function getDirname(metaUrl) {
  const __filename = fileURLToPath(metaUrl);
  return dirname(__filename);
}