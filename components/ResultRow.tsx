import React from 'react';
import { ProcessedFile } from '../types';
import { formatBytes } from '../utils/compression';
import { Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ResultRowProps {
  file: ProcessedFile;
}

export const ResultRow: React.FC<ResultRowProps> = ({ file }) => {
  const handleDownload = () => {
    if (!file.compressedBlob) return;
    const url = URL.createObjectURL(file.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    // Append '-optimized' to original name
    const nameParts = file.originalFile.name.split('.');
    const ext = nameParts.pop();
    const newName = `${nameParts.join('.')}-optipress.${file.settings.format.split('/')[1] === 'jpeg' ? 'jpg' : file.settings.format.split('/')[1]}`;
    a.download = newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-4">
      {/* Preview */}
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
        <img 
          src={file.previewUrl} 
          alt={`Original image: ${file.originalFile.name} - Ready for optimization`}
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h4 className="text-sm font-medium text-gray-900 truncate" title={file.originalFile.name}>
          {file.originalFile.name}
        </h4>
        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <span className="text-xs text-gray-500">{formatBytes(file.originalSize)}</span>
            {file.status === 'done' && (
                <>
                    <span className="text-xs text-gray-400">&rarr;</span>
                    <span className="text-xs font-bold text-green-600">{formatBytes(file.compressedSize)}</span>
                </>
            )}
        </div>
      </div>

      {/* Status & Action */}
      <div className="flex items-center gap-4">
        {file.status === 'processing' && (
          <div className="flex items-center text-blue-600 text-sm">
             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
             Compressing...
          </div>
        )}
        
        {file.status === 'error' && (
          <div className="flex items-center text-red-500 text-sm">
             <AlertCircle className="w-4 h-4 mr-2" />
             Error
          </div>
        )}

        {file.status === 'done' && (
          <>
             <div className="hidden sm:block text-right mr-2">
                <div className="text-sm font-bold text-green-600">-{file.compressionRatio.toFixed(0)}%</div>
                <div className="text-xs text-gray-400">Saved</div>
             </div>
             <button 
                onClick={handleDownload}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
                aria-label={`Download compressed version of ${file.originalFile.name}`}
             >
                <Download className="w-4 h-4 mr-2" />
                Download
             </button>
          </>
        )}
      </div>
    </div>
  );
};