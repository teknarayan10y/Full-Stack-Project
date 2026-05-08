import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFileUpload } from '../context/FileUploadContext';
import FileDropZone from '../components/common/FileDropZone';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 1rem;
  margin: 0;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem;
`;

const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const FileCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const FilePreview = styled.div`
  height: 150px;
  background-color: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const FileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FileIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
`;

const FileInfo = styled.div`
  padding: 0.75rem;
`;

const FileName = styled.h3`
  font-size: 0.875rem;
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textLight};
  margin: 0;
`;

const FileActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
  
  &.delete {
    color: ${props => props.theme.colors.error};
    
    &:hover {
      color: ${props => props.theme.colors.errorDark};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: ${props => props.theme.colors.textLight};
`;

const FileUploadPage = () => {
  const { files, getUserFiles, deleteFile, error } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    getUserFiles();
  }, [getUserFiles]);
  
  const handleFilesUploaded = (uploadedFiles) => {
    console.log('Files uploaded:', uploadedFiles);
  };
  
  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      await deleteFile(fileId);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.startsWith('audio/')) return 'audio';
    if (fileType.includes('pdf')) return 'file-pdf';
    if (fileType.includes('word')) return 'file-word';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'file-excel';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'file-powerpoint';
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'file-archive';
    return 'file';
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>File Manager</PageTitle>
        <PageDescription>Upload, manage, and use files in your projects</PageDescription>
      </PageHeader>
      
      <Card>
        <CardTitle>Upload Files</CardTitle>
        <FileDropZone 
          onFilesUploaded={handleFilesUploaded}
          maxFiles={5}
          acceptedFileTypes="image/jpeg,image/png,image/gif,application/pdf"
          maxFileSize={10485760} // 10MB
          dropzoneText="Drag and drop files here"
          dropzoneSubText="or click to browse (JPEG, PNG, GIF, PDF up to 10MB)"
        />
      </Card>
      
      <Card>
        <CardTitle>Your Files</CardTitle>
        
        {files.length === 0 ? (
          <EmptyState>
            <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
            <p>You haven't uploaded any files yet</p>
          </EmptyState>
        ) : (
          <FilesGrid>
            {files.map(file => (
              <FileCard key={file._id}>
                <FilePreview>
                  {file.type.startsWith('image/') ? (
                    <FileImage src={file.url} alt={file.name} />
                  ) : (
                    <FileIcon>
                      <i className={`fas fa-${getFileIcon(file.type)}`}></i>
                    </FileIcon>
                  )}
                </FilePreview>
                
                <FileInfo>
                  <FileName>{file.name}</FileName>
                  <FileSize>{formatFileSize(file.size)}</FileSize>
                </FileInfo>
                
                <FileActions>
                  <ActionButton onClick={() => window.open(file.url, '_blank')}>
                    <i className="fas fa-external-link-alt" style={{ marginRight: '4px' }}></i> View
                  </ActionButton>
                  
                  <ActionButton className="delete" onClick={() => handleDeleteFile(file._id)}>
                    <i className="fas fa-trash-alt" style={{ marginRight: '4px' }}></i> Delete
                  </ActionButton>
                </FileActions>
              </FileCard>
            ))}
          </FilesGrid>
        )}
      </Card>
    </PageContainer>
  );
};

export default FileUploadPage;
