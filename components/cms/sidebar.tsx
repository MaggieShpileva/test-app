'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Folder, 
  FolderOpen, 
} from 'lucide-react';
import { CMSFile } from '@/lib/types/cms';
import { fetchFiles } from '@/lib/utils/file-operations';

interface SidebarProps {
  onFileSelect: (file: CMSFile) => void;
  onNewFile: () => void;
  selectedFile?: CMSFile;
}

export default function Sidebar({ onFileSelect, onNewFile, selectedFile }: SidebarProps) {
  const [files, setFiles] = useState<CMSFile[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await fetchFiles();
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const toggleFolder = (filePath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(filePath)) {
      newExpanded.delete(filePath);
    } else {
      newExpanded.add(filePath);
    }
    setExpandedFolders(newExpanded);
  };

 

  const renderFileItem = (file: CMSFile, level = 0) => {
    const isExpanded = expandedFolders.has(file.path);
    const isSelected = selectedFile?.path === file.path;
    
    return (
      <div key={file.path}>
        <div
          className={`
            flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition-colors
            ${isSelected ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}
            ${level > 0 ? `ml-${level * 4}` : ''}
          `}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => {
            if (file.type === 'directory') {
              toggleFolder(file.path);
            } else {
              onFileSelect(file);
            }
          }}
        >
          {file.type === 'directory' ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-gray-500" />
            ) : (
              <Folder className="w-4 h-4 text-gray-500" />
            )
          ) : (
            <FileText className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm truncate">{file.name}</span>
        </div>
        
        {file.type === 'directory' && isExpanded && (
          <div>
            {files
              .filter(f => f.path.startsWith(file.path + '/') && f.path.split('/').length === file.path.split('/').length + 1)
              .map(child => renderFileItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="cms-sidebar h-full w-60 flex flex-col">
      <div className="p-4 border-b w-60 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">CMS</h2>
          <button
            onClick={onNewFile}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
            title="Создать новый файл"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search */}
        
      </div>

    

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {files
            .map(file => renderFileItem(file))}
        </div>
      </div>
    </div>
  );
}
