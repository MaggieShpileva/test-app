import matter from 'gray-matter';
import { CMSContent, CMSFile } from '@/lib/types/cms';

// Клиентские функции для работы с API
export async function fetchFiles(): Promise<CMSFile[]> {
  try {
    const response = await fetch('/api/cms/files');
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}

export async function fetchFileContent(filePath: string): Promise<string> {
  try {
    const response = await fetch(`/api/cms/files/${encodeURIComponent(filePath)}`);
    if (response.ok) {
      const data = await response.json();
      return data.content || '';
    }
    return '';
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
}

export async function saveFileContent(filePath: string, content: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/cms/files/${encodeURIComponent(filePath)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
  }
}

export async function deleteFileContent(filePath: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/cms/files/${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export function parseMarkdownFile(content: string): CMSContent {
  const { data: frontmatter, content: body } = matter(content);
  
  return {
    id: frontmatter.id || '',
    title: frontmatter.title || '',
    slug: frontmatter.slug || '',
    content: body,
    excerpt: frontmatter.excerpt || '',
    published: frontmatter.published ?? true,
    tags: frontmatter.tags || [],
    author: frontmatter.author || '',
    featuredImage: frontmatter.featuredImage || '',
    metadata: frontmatter,
  };
}

export function stringifyMarkdownFile(content: CMSContent): string {
  const frontmatter = {
    id: content.id,
    title: content.title,
    slug: content.slug,
    excerpt: content.excerpt,
    published: content.published,
    tags: content.tags,
    author: content.author,
    featuredImage: content.featuredImage,
    ...content.metadata,
  };
  
  return matter.stringify(content.content, frontmatter);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isMarkdownFile(filename: string): boolean {
  const ext = filename.toLowerCase();
  return ext.endsWith('.md') || ext.endsWith('.markdown');
}
