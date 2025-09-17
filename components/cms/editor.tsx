'use client';

import { useState, useEffect } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { 
  Save, 
  FileText,
} from 'lucide-react';
import { CMSFile, CMSContent } from '@/lib/types/cms';
import { parseMarkdownFile, stringifyMarkdownFile } from '@/lib/utils/file-operations';

interface EditorProps {
  file?: CMSFile;
  onSave: (content: string) => void;
}

export default function Editor({ file, onSave }: EditorProps) {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [rawContent, setRawContent] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (file && file.content) {
      const parsed = parseMarkdownFile(file.content);
      setContent(parsed);
      setRawContent(file.content);
      setUnsavedChanges(false);
    }
  }, [file]);

  const handleSave = async () => {
    if (!content) return;
    
    const updatedContent = stringifyMarkdownFile(content);
    await onSave(updatedContent);
    setUnsavedChanges(false);
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setRawContent(value);
      setUnsavedChanges(true);
      
      try {
        const parsed = parseMarkdownFile(value);
        setContent(parsed);
      } catch (error) {
        console.error('Error parsing content:', error);
      }
    }
  };

  if (!file) {
    return (
      <div className="cms-main flex items-center justify-center ml-10">
        <div className="text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Выберите файл для редактирования</p>
          <p className="text-sm mt-2">Используйте боковую панель для навигации по файлам</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-main flex flex-col ml-10">
      {/* Header */}
      <div className="cms-header flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {content?.metadata?.title || file.name}
          </h1>
          {unsavedChanges && (
            <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Несохраненные изменения
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          
          <button
            onClick={handleSave}
            disabled={!unsavedChanges}
            className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[100dvh]">
        
        <MonacoEditor
              height="100%"
              defaultLanguage="markdown"
              value={rawContent}
              onChange={handleContentChange}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontSize: 14,
                fontFamily: 'var(--font-geist-mono), monospace',
              }}
            />
      </div>
    </div>
  );
}
