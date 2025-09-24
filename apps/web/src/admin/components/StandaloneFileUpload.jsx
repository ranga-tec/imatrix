// ===============================
// STANDALONE FILE UPLOAD COMPONENT (NO REACT ADMIN DEPENDENCY)
// ===============================
// apps/web/src/admin/components/StandaloneFileUpload.jsx
// File upload component that works outside React Admin forms

import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, Video } from 'lucide-react';

const StandaloneFileUpload = ({ 
  accept, 
  multiple = false, 
  label, 
  helperText, 
  maxSize = 10 * 1024 * 1024, 
  onChange,
  files = [] 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);

  // File type validation
  const validateFile = (file) => {
    const fileErrors = [];
    
    if (maxSize && file.size > maxSize) {
      fileErrors.push(`File "${file.name}" is too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return fileErrors;
    }

    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(acceptedType => {
        if (acceptedType.startsWith('.')) {
          return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
        }
        if (acceptedType.includes('*')) {
          const baseType = acceptedType.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === acceptedType;
      });

      if (!isValidType) {
        fileErrors.push(`File type not allowed for "${file.name}". Accepted: ${accept}`);
      }
    }

    return fileErrors;
  };

  // Handle file selection
  const handleFiles = useCallback(async (fileList) => {
    const fileArray = Array.from(fileList);
    const newPreviews = [];
    const validFiles = [];
    const allErrors = [];

    setUploading(true);
    setErrors([]);

    try {
      for (const file of fileArray) {
        const fileErrors = validateFile(file);
        
        if (fileErrors.length > 0) {
          allErrors.push(...fileErrors);
          continue;
        }

        // Create preview
        const preview = {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        };
        
        newPreviews.push(preview);
        validFiles.push(file);
      }

      if (allErrors.length > 0) {
        setErrors(allErrors);
      }

      if (validFiles.length > 0) {
        if (multiple) {
          const updatedPreviews = [...previews, ...newPreviews];
          const updatedFiles = [...files, ...validFiles];
          setPreviews(updatedPreviews);
          
          if (onChange) {
            onChange(updatedFiles);
          }
        } else {
          setPreviews(newPreviews);
          
          if (onChange) {
            onChange(validFiles[0]);
          }
        }
      }
    } catch (error) {
      setErrors(['Error processing files']);
    } finally {
      setUploading(false);
    }
  }, [files, multiple, onChange, accept, maxSize, previews]);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // File input change
  const handleInputChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  }, [handleFiles]);

  // Remove file
  const removeFile = useCallback((index) => {
    if (multiple) {
      const newPreviews = previews.filter((_, i) => i !== index);
      const newFiles = files.filter((_, i) => i !== index);
      setPreviews(newPreviews);
      
      if (onChange) {
        onChange(newFiles);
      }
    } else {
      setPreviews([]);
      
      if (onChange) {
        onChange(null);
      }
    }
  }, [multiple, previews, files, onChange]);

  // Get file icon
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return FileText;
  };

  return (
    <div className="standalone-file-upload">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {helperText && <span className="text-gray-500 font-normal"> - {helperText}</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('standalone-file-input').click()}
      >
        <input
          id="standalone-file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="text-gray-600">
          <span className="font-medium">Click to upload</span> or drag and drop
        </div>
        {accept && (
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: {accept}
          </p>
        )}
        {maxSize && (
          <p className="text-sm text-gray-500">
            Maximum file size: {(maxSize / 1024 / 1024).toFixed(1)}MB
          </p>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="mt-4 space-y-2">
          {previews.map((preview, index) => {
            const Icon = getFileIcon(preview.type);
            return (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg border"
              >
                {preview.url ? (
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-10 h-10 object-cover rounded mr-3"
                  />
                ) : (
                  <Icon className="w-10 h-10 text-gray-400 mr-3" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {preview.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(preview.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="ml-4 text-red-400 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {uploading && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Processing files...
          </div>
        </div>
      )}
    </div>
  );
};

export default StandaloneFileUpload;