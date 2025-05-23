import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Box, Grid, Paper, Typography, Checkbox } from '@mui/material';
import { pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PageThumbnails = ({ 
  file, 
  numPages, 
  currentPage, 
  selectedPages = [], 
  onPageClick, 
  onPageSelect 
}) => {
  const [thumbnails, setThumbnails] = useState([]);
  
  // Generate array of page numbers
  useEffect(() => {
    if (numPages) {
      setThumbnails(Array.from({ length: numPages }, (_, i) => i + 1));
    }
  }, [numPages]);
  
  return (
    <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
      <Grid container spacing={2}>
        {thumbnails.map((pageNum) => (
          <Grid item xs={12} key={pageNum}>
            <Paper 
              elevation={currentPage === pageNum ? 3 : 1}
              sx={{ 
                p: 1, 
                cursor: 'pointer',
                border: currentPage === pageNum ? '2px solid' : '1px solid',
                borderColor: currentPage === pageNum ? 'primary.main' : 'divider',
                position: 'relative'
              }}
              onClick={() => onPageClick(pageNum)}
            >
              <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}>
                <Checkbox
                  checked={selectedPages.includes(pageNum)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onPageSelect(pageNum);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Document file={file} loading={<Box sx={{ height: 100 }} />}>
                  <Page 
                    pageNumber={pageNum} 
                    width={150}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </Box>
              <Typography variant="body2" align="center">
                Page {pageNum}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PageThumbnails;
