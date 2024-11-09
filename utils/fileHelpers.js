import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

export async function ensureDirectoryExists(dir) {
    await mkdir(dir, { recursive: true });
}

export async function saveFile(filePath, data) {
    await writeFile(filePath, data);
    return filePath;
}

export function getFileNameFromUrl(url, index) {
    return url.split('/').pop() || `file_${index + 1}`;
}