import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    // Замените на ваш GitHub репозиторий
    const githubUrl = `https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/${filePath}`;
    
    const response = await fetch(githubUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Добавьте токен если нужен доступ к приватному репозиторию
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Декодируем base64 содержимое
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    
    return NextResponse.json({
      path: data.path,
      content,
      isMarkdown: filePath.endsWith('.md'),
    });
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content from GitHub' },
      { status: 500 }
    );
  }
}
