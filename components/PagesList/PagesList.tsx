'use client';

import { useState, useEffect } from 'react';
import { fetchFiles, fetchFileContent, parseMarkdownFile } from '@/lib/utils/file-operations';
import {  CMSContent } from '@/lib/types/cms';
import { Card } from '../Card/Card';

interface PagesListProps {
  className?: string;
}

export default function PagesList({ className = '' }: PagesListProps) {
  const [pages, setPages] = useState<(CMSContent | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);

      const allFiles = await fetchFiles();
      
      const pageFiles = allFiles.filter(file => 
        file.type === 'file' && 
        file.path.startsWith('content/') && 
        file.name.endsWith('.md')
      );
      

      const pagesData = await Promise.all(
        pageFiles.map(async (file) => {
          try {
            const content = await fetchFileContent(file.path);
            if (content) {
              return parseMarkdownFile(content);
            }
            return null;
          } catch (error) {
            console.error(`Ошибка загрузки файла ${file.path}:`, error);
            return null;
          }
        })
      );
     
      setPages(pagesData);
    } catch (error) {
      console.error('Ошибка загрузки страниц:', error);

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2">Загрузка страниц...</span>
      </div>
    );
  }

  
  

  return (
    <div className={`space-y-6 ${className}`}>
      
      <div className="flex flex-col">
        {pages && pages?.map((page: CMSContent | null) => (
         page && <Card key={page.id} data={page} />
        ))}
      </div>
    </div>
  );
}

