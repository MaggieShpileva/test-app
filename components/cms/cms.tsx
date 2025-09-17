'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
import Editor from './editor';
import { CMSFile } from '@/lib/types/cms';
import { fetchFileContent, saveFileContent } from '@/lib/utils/file-operations';

type CMSTab = 'editor' | 'preview';

export default function CMS() {
  const [selectedFile, setSelectedFile] = useState<CMSFile | undefined>();

  const handleFileSelect = async (file: CMSFile) => {
    try {
      const content = await fetchFileContent(file.path);
      setSelectedFile({
        ...file,
        content,
      });
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleSave = async (content: string) => {
    if (!selectedFile) return;
    
    try {
      const success = await saveFileContent(selectedFile.path, content);
      if (success) {
        console.log('File saved successfully');
      } else {
        console.error('Failed to save file');
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleNewFile = () => {
    const title = prompt('Введите заголовок новой страницы:');
    if (!title) return;
    
    const content = `# ${title}\n\nНачните писать здесь...`;
    
    // Create new file via API
    fetch('/api/cms/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        published: false,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('New page created:', data);
        // Refresh the page to show new file
        window.location.reload();
      })
      .catch(error => {
        console.error('Error creating new page:', error);
      });
  };




  return (
    <div className="cms-editor flex h-screen">
        <Sidebar
          onFileSelect={handleFileSelect}
          onNewFile={handleNewFile}
          selectedFile={selectedFile}
        />
      
      <div className="flex-1 flex flex-col w-96">
        
          <Editor
            file={selectedFile}
            onSave={handleSave}
          />
          
         
      </div>
    </div>
  );
}
