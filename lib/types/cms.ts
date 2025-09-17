export interface CMSContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  tags?: string[];
  author?: string;
  featuredImage?: string;
  metadata?: Record<string, string>;
}

export interface CMSPage extends CMSContent {
  type: 'page';
  parent?: string;
  order?: number;
}

export interface CMSCollection {
  name: string;
  label: string;
  path: string;
  format: 'md' | 'json' | 'yaml';
  fields: CMSField[];
  templates?: CMSField[][];
}

export interface CMSField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'rich-text' | 'number' | 'boolean' | 'date' | 'select' | 'image' | 'file' | 'object' | 'array';
  required?: boolean;
  options?: { label: string; value: string }[];
  default?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  fields?: CMSField[]; // For object and array types
}

export interface CMSConfig {
  collections: CMSCollection[];
  media_folder: string;
  public_folder: string;
  site_url?: string;
  display_url?: string;
}

export interface CMSEditorState {
  isEditing: boolean;
  currentPage?: string;
  previewMode: boolean;
  sidebarOpen: boolean;
  unsavedChanges: boolean;
}

export interface CMSFile {
  path: string;
  name: string;
  size: number;
  modified: string;
  type: 'file' | 'directory';
  content?: string;
}
