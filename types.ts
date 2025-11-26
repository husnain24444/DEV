export interface ProcessedFile {
  id: string;
  originalFile: File;
  compressedBlob: Blob | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  previewUrl: string;
  settings: CompressionSettings;
}

export interface CompressionSettings {
  quality: number; // 0.1 to 1.0
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  maxWidth?: number;
}

export interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}
