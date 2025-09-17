import { NextRequest, NextResponse } from 'next/server';

// Для production используйте внешнее хранилище (GitHub, GitLab, или база данных)
const CONTENT_STORAGE = {
  'content/pari.md': {
    path: 'content/pari.md',
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
    isMarkdown: true
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  const content = CONTENT_STORAGE[path as keyof typeof CONTENT_STORAGE];
  
  if (!content) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  return NextResponse.json(content);
}
