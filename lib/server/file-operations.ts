import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CMSFile, CMSContent } from '@/lib/types/cms';

export const CONTENT_DIR = path.join(process.cwd(), 'content');

export async function readFileContent(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    return '';
  }
}

export async function writeFileContent(filePath: string, content: string): Promise<boolean> {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export async function getDirectoryContents(dirPath: string): Promise<CMSFile[]> {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    
    const fileList: CMSFile[] = [];
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      const stats = await fs.stat(fullPath);
      
      const relativePath = path.relative(process.cwd(), fullPath);
      
      fileList.push({
        path: relativePath, // Используем относительный путь
        name: file.name,
        size: stats.size,
        modified: stats.mtime.toISOString(),
        type: file.isDirectory() ? 'directory' : 'file',
      });
    }
    
    return fileList.sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

export async function getAllFilesRecursively(dirPath: string): Promise<CMSFile[]> {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    
    const fileList: CMSFile[] = [];
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      const stats = await fs.stat(fullPath);
      const relativePath = path.relative(process.cwd(), fullPath);
      
      if (file.isDirectory()) {
        // Рекурсивно получаем содержимое папок
        const subFiles = await getAllFilesRecursively(fullPath);
        fileList.push(...subFiles);
        
        // Добавляем саму папку
        fileList.push({
          path: relativePath,
          name: file.name,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          type: 'directory',
        });
      } else {
        fileList.push({
          path: relativePath,
          name: file.name,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          type: 'file',
        });
      }
    }
    
    return fileList.sort((a, b) => {
      // Сначала папки, потом файлы
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error reading directory recursively:', error);
    return [];
  }
}

export function parseMarkdownFile(content: string): CMSContent {
 return JSON.parse(content);
}

export function stringifyMarkdownFile(content: CMSContent): string {
  return JSON.stringify(content);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function isMarkdownFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ext === '.md' || ext === '.markdown';
}
