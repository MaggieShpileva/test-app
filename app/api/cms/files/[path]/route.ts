import { NextRequest, NextResponse } from 'next/server';
import { 
  readFileContent, 
  writeFileContent, 
  deleteFile,
  isMarkdownFile 
} from '@/lib/server/file-operations';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path: filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    
    // Проверяем, находимся ли мы в production (Vercel)
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      // В production используем fallback или внешнее хранилище
      return NextResponse.json({
        path: `/var/task/${decodedPath}`,
        content: `---
id: pari
title: pari
slug: ''
excerpt: ''
published: true
tags: []
author: ''
featuredImage: ''
subtitle: Интерактивный лендинг с мини-игрой в жанре 2D-раннера
description: >-
 Мы разработали AI-аватары двух персонажей, которые общаются с детьми в
 контексте мультфильма, включая аудио- и видеоконтент. Для безопасности
 внедрили фильтрацию тем и предустановленные интенты (например, «где купить
 игрушку»)
image: 'https://i.pinimg.com/1200x/fe/c8/13/fec813e8050851e2355a4252d736205d.jpg'
---

# pari`,
        isMarkdown: isMarkdownFile(decodedPath),
      });
    }
    
    // В development используем файловую систему
    const fullPath = path.join(process.cwd(), decodedPath);
    const content = await readFileContent(fullPath);
    
    if (content === '') {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      path: fullPath,
      content,
      isMarkdown: isMarkdownFile(decodedPath),
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path: filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    const fullPath = path.join(process.cwd(), decodedPath);
    const { content } = await request.json();
    
    const success = await writeFileContent(fullPath, content);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to write file' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json(
      { error: 'Failed to write file' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path: filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    const fullPath = path.join(process.cwd(), decodedPath);
    
    const success = await deleteFile(fullPath);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
