import React, { useState } from 'react';
import styled from 'styled-components';
import { useFileUpload } from '../../../context/FileUploadContext';
import FileDropZone from '../../common/FileDropZone';

const ComponentContainer = styled.div`
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
`;

const Title = styled.h3`
  font-size: ${props => props.titleSize || '1rem'};
  color: ${props => props.titleColor || props.theme.colors.text};
  margin-bottom: 0.5rem;
  text-align: ${props => props.titleAlignment || 'left'};
`;

const Description = styled.p`
  font-size: ${props => props.descriptionSize || '0.875rem'};
  color: ${props => props.descriptionColor || props.theme.colors.textLight};
  margin-bottom: 1rem;
  text-align: ${props => props.descriptionAlignment || 'left'};
`;

const UploadedFilesContainer = styled.div`
  margin-top: 1rem;
`;

const UploadedFilesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
`;

const FileItem = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FilePreview = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const FileImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const FileIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
`;

const FileName = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const FileUploadComponent = ({
  title,
  description,
  titleSize,
  titleColor,
  titleAlignment,
  descriptionSize,
  descriptionColor,
  descriptionAlignment,
  width,
  margin,
  padding,
  acceptedFileTypes,
  maxFileSize,
  maxFiles,
  onFilesUploaded,
  projectId
}) => {
  const { uploadFile, files } = useFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFilesUploaded = (newFiles) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
    if (onFilesUploaded) {
      onFilesUploaded(newFiles);
    }
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
    <ComponentContainer
      width={width}
      margin={margin}
      padding={padding}
    >
      {title && (
        <Title
          titleSize={titleSize}
          titleColor={titleColor}
          titleAlignment={titleAlignment}
        >
          {title}
        </Title>
      )}
      
      {description && (
        <Description
          descriptionSize={descriptionSize}
          descriptionColor={descriptionColor}
          descriptionAlignment={descriptionAlignment}
        >
          {description}
        </Description>
      )}
      
      <FileDropZone
        onFilesUploaded={handleFilesUploaded}
        maxFiles={maxFiles || 5}
        acceptedFileTypes={acceptedFileTypes || '*'}
        maxFileSize={maxFileSize || 5242880}
        dropzoneText="Drag and drop files here"
        dropzoneSubText="or click to browse"
        projectId={projectId}
      />
      
      {uploadedFiles.length > 0 && (
        <UploadedFilesContainer>
          <Title titleSize="0.875rem">Uploaded Files</Title>
          <UploadedFilesList>
            {uploadedFiles.map((file, index) => (
              <FileItem key={index}>
                <FilePreview>
                  {file.type && file.type.startsWith('image/') ? (
                    <FileImage src={file.url} alt={file.name} />
                  ) : (
                    <FileIcon>
                      <i className={`fas fa-${getFileIcon(file.type)}`}></i>
                    </FileIcon>
                  )}
                </FilePreview>
                <FileName>{file.name}</FileName>
              </FileItem>
            ))}
          </UploadedFilesList>
        </UploadedFilesContainer>
      )}
    </ComponentContainer>
  );
};

export default FileUploadComponent;
