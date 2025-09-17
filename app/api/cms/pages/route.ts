import { NextRequest, NextResponse } from 'next/server';
import { 
  getDirectoryContents, 
  readFileContent, 
  parseMarkdownFile,
  generateSlug,
  isMarkdownFile 
} from '@/lib/server/file-operations';
import path from 'path';
import { CMSContent } from '@/lib/types/cms';

export async function GET() {
  try {
    const pagesDir = path.join(process.cwd(), 'content', 'pages');
    const files = await getDirectoryContents(pagesDir);
    
    const pages: CMSContent[] = [];
    
    for (const file of files) {
      if (file.type === 'file' && isMarkdownFile(file.name)) {
        const content = await readFileContent(file.path);
        if (content) {
          const parsed = parseMarkdownFile(content);
          pages.push(parsed);
        }
      }
    }
    
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, content, published = true } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const pageSlug = slug || generateSlug(title);
    const fileName = `${pageSlug}.md`;
    const filePath = path.join(process.cwd(), 'content', 'pages', fileName);
    
    const newPage: CMSContent = {
      id: pageSlug,
      title,
      slug: pageSlug,
      content,
      published,
      tags: [],
      author: 'Admin',
    };
    
    const markdownContent = `---
id: ${newPage.id}
title: ${newPage.title}
slug: ${newPage.slug}
published: ${newPage.published}
tags: []
author: ${newPage.author}
---

${newPage.content}`;
    
    // Write file
    const fs = await import('fs/promises');
    await fs.writeFile(filePath, markdownContent, 'utf-8');
    
    return NextResponse.json(newPage);
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
