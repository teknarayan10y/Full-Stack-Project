import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useFileUpload } from '../../context/FileUploadContext';

const DropContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background-color: ${props => props.isDragActive ? props.theme.colors.primaryLight : props.theme.colors.background};
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
`;

const UploadSubText = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 3px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const FilePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  width: 100%;
`;

const FilePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

const FilePreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FilePreviewName = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FilePreviewIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.background};
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.colors.error};
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  z-index: 1;
  
  &:hover {
    background-color: ${props => props.theme.colors.errorDark};
  }
`;

const FileDropZone = ({ 
  onFilesUploaded, 
  maxFiles = 10, 
  acceptedFileTypes = '*', 
  maxFileSize = 5242880, // 5MB
  showPreviews = true,
  dropzoneText = 'Drag and drop files here',
  dropzoneSubText = 'or click to browse'
}) => {
  const { uploadFiles, uploading, uploadProgress, error, clearError } = useFileUpload();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  
  const fileInputRef = React.useRef(null);

  const validateFiles = (files) => {
    const errors = [];
    const validFiles = [];
    
    Array.from(files).forEach(file => {
      // Check file type if specified
      if (acceptedFileTypes !== '*') {
        const fileTypes = acceptedFileTypes.split(',').map(type => type.trim());
        const fileType = file.type.split('/')[1];
        
        if (!fileTypes.includes(fileType) && !fileTypes.includes(file.type)) {
          errors.push(`${file.name}: File type not supported`);
          return;
        }
      }
      
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size exceeds ${maxFileSize / 1048576}MB`);
        return;
      }
      
      validFiles.push(file);
    });
    
    // Check max files
    if (validFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      validFiles.splice(maxFiles);
    }
    
    setFileErrors(errors);
    return validFiles;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = validateFiles(e.dataTransfer.files);
      setSelectedFiles(validFiles);
      
      if (validFiles.length > 0 && fileErrors.length === 0) {
        const uploadedFiles = await uploadFiles(validFiles);
        if (onFilesUploaded) {
          onFilesUploaded(uploadedFiles);
        }
      }
    }
  }, [uploadFiles, onFilesUploaded, fileErrors, maxFiles, acceptedFileTypes, maxFileSize]);

  const handleFileInputChange = useCallback(async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      setSelectedFiles(validFiles);
      
      if (validFiles.length > 0 && fileErrors.length === 0) {
        const uploadedFiles = await uploadFiles(validFiles);
        if (onFilesUploaded) {
          onFilesUploaded(uploadedFiles);
        }
      }
    }
  }, [uploadFiles, onFilesUploaded, fileErrors, maxFiles, acceptedFileTypes, maxFileSize]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const getFileIcon = (file) => {
    const fileType = file.type.split('/')[0];
    
    switch (fileType) {
      case 'image':
        return URL.createObjectURL(file);
      case 'video':
        return 'video';
      case 'audio':
        return 'audio';
      case 'application':
        if (file.type.includes('pdf')) return 'pdf';
        if (file.type.includes('word')) return 'word';
        if (file.type.includes('excel')) return 'excel';
        return 'document';
      default:
        return 'file';
    }
  };

  return (
    <div>
      <DropContainer
        isDragActive={dragActive}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <FileInput
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileInputChange}
        />
        
        <UploadIcon>
          <i className="fas fa-cloud-upload-alt"></i>
        </UploadIcon>
        
        <UploadText>{dropzoneText}</UploadText>
        <UploadSubText>{dropzoneSubText}</UploadSubText>
        
        {uploading && (
          <ProgressContainer>
            <ProgressBar progress={uploadProgress} />
          </ProgressContainer>
        )}
      </DropContainer>
      
      {fileErrors.length > 0 && (
        <ErrorMessage>
          {fileErrors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </ErrorMessage>
      )}
      
      {error && (
        <ErrorMessage>
          {error}
          <button onClick={clearError}>Clear</button>
        </ErrorMessage>
      )}
      
      {showPreviews && selectedFiles.length > 0 && (
        <FilePreviewContainer>
          {selectedFiles.map((file, index) => {
            const fileIcon = getFileIcon(file);
            
            return (
              <FilePreview key={index}>
                <RemoveButton onClick={() => removeFile(index)}>×</RemoveButton>
                
                {fileIcon.startsWith('blob:') ? (
                  <FilePreviewImage src={fileIcon} alt={file.name} />
                ) : (
                  <FilePreviewIcon>
                    <i className={`fas fa-${fileIcon}`}></i>
                  </FilePreviewIcon>
                )}
                
                <FilePreviewName>{file.name}</FilePreviewName>
              </FilePreview>
            );
          })}
        </FilePreviewContainer>
      )}
    </div>
  );
};

export default FileDropZone;
