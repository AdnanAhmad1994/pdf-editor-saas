import React, { useState } from 'react';
import { Box, Button, Typography, Paper, DropzoneArea } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFilesSelected, accept = '*', multiple = true, maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept ? { [accept.includes('/') ? accept : `application/${accept.replace('.', '')}`]: [] } : undefined,
    multiple,
    maxFiles,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      onFilesSelected(acceptedFiles);
    }
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          borderRadius: 2,
          backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.04)'
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}
      >
        <input {...getInputProps()} id="file-upload-input" />
        <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" align="center" gutterBottom>
          {isDragActive ? 'Drop the files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          or click to select files
        </Typography>
        {accept && (
          <Typography variant="caption" align="center" color="textSecondary" sx={{ mt: 1 }}>
            Accepted file types: {accept}
          </Typography>
        )}
        {multiple && (
          <Typography variant="caption" align="center" color="textSecondary">
            You can upload up to {maxFiles} files
          </Typography>
        )}
      </Paper>
      
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Files:
          </Typography>
          {files.map((file, index) => (
            <Typography key={index} variant="body2">
              {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
