import React, { useState, useRef, useEffect } from 'react';
import { PHOTO_TYPES } from '../../utils/image';

/**
 * PhotoUpload - Drag-and-Drop & Browse Photo Upload Zone
 * Supports live thumbnail preview using URL.createObjectURL(), file size validation,
 * and memory cleanup via URL.revokeObjectURL().
 *
 * @param {function} onFileChange - Callback passing the selected File or null
 * @param {number} maxSizeBytes - Maximum allowed size in bytes (default 5MB)
 */
export default function PhotoUpload({
  onFileChange,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB
  className = '',
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Generate and manage temporary browser memory preview URL
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Cleanup memory when component unmounts or file changes
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleFileProcess = (selectedFile) => {
    setErrorMsg('');

    if (!selectedFile) return;

    // 1. Verify MIME type is image
    if (!PHOTO_TYPES.includes(selectedFile.type)) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // 2. Verify file size limit
    if (selectedFile.size > maxSizeBytes) {
      const sizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      setErrorMsg(`Image size exceeds the ${sizeMB}MB limit. Please upload a smaller photo.`);
      return;
    }

    setFile(selectedFile);
    if (onFileChange) {
      onFileChange(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleFileProcess(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileProcess(droppedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={PHOTO_TYPES.join(',')}
        onChange={handleInputChange}
        className="hidden"
        id="problem-photo-upload"
      />

      {/* 1. When a photo is selected: High-Polish Live Preview Thumbnail */}
      {previewUrl ? (
        <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4">
          {/* Thumbnail Image */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-md overflow-hidden border border-slate-300 bg-white shrink-0 shadow-xs relative">
            <img
              src={previewUrl}
              alt="Problem Ground Evidence Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Metadata & Actions */}
          <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-xs font-bold text-slate-800 truncate">
                {file?.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              File Size: {file ? formatFileSize(file.size) : '0 KB'} • Type: {file?.type}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">
              ✓ Ground evidence image attached to grievance
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-700 transition cursor-pointer"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-2.5 py-1 bg-white hover:bg-red-50 border border-red-200 rounded text-xs font-medium text-red-600 transition cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Upload Dropzone when no photo is selected */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition duration-150 ease-in-out
            flex flex-col items-center justify-center gap-2
            ${
              isDragOver
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
            }
          `}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl mb-1 shadow-2xs">
            📸
          </div>

          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Drag & Drop photo evidence here, or{' '}
              <span className="text-primary underline">Browse files</span>
            </span>
            <p className="text-[11px] text-slate-500">
              Supports JPG, PNG, WebP up to 5MB (Clear photos accelerate verification)
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium animate-in fade-in duration-150">
          <svg className="w-3.5 h-3.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMsg}</span>
        </p>
      )}
    </div>
  );
}
