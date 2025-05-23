import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import EditorToolbar from '../components/EditorToolbar';
import EnhancedTextEditor from '../components/EnhancedTextEditor';
import { fetchDocument, setCurrentPage, setZoom, setSelectedElement } from '../services/editorSlice';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFEditor = ({ documentId }) => {
  const dispatch = useDispatch();
  const { 
    currentDocument, 
    pages, 
    textElements, 
    loading, 
    error, 
    zoom, 
    currentPage,
    activeToolbar,
    selectedElement
  } = useSelector(state => state.editor);
  
  const [numPages, setNumPages] = useState(null);
  const [editingText, setEditingText] = useState(null);
  
  useEffect(() => {
    if (documentId) {
      dispatch(fetchDocument(documentId));
    }
  }, [dispatch, documentId]);
  
  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  
  const handleZoomIn = () => {
    dispatch(setZoom(Math.min(zoom + 0.1, 2.0)));
  };
  
  const handleZoomOut = () => {
    dispatch(setZoom(Math.max(zoom - 0.1, 0.5)));
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < numPages - 1) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };
  
  const handleTextElementClick = (element) => {
    dispatch(setSelectedElement(element));
    setEditingText(element);
  };
  
  const handleCloseTextEditor = () => {
    setEditingText(null);
  };
  
  // Render text elements on the PDF
  const renderTextElements = () => {
    return textElements
      .filter(element => element.page === currentPage)
      .map(element => (
        <Box
          key={element.id}
          sx={{
            position: 'absolute',
            left: `${element.position.x * zoom}px`,
            top: `${element.position.y * zoom}px`,
            cursor: 'pointer',
            padding: '4px',
            border: selectedElement?.id === element.id ? '1px dashed blue' : 'none',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)'
            }
          }}
          onClick={() => handleTextElementClick(element)}
        >
          <Typography
            sx={{
              fontFamily: element.style.fontFamily,
              fontSize: `${element.style.fontSize * zoom}px`,
              fontWeight: element.style.fontWeight,
              fontStyle: element.style.fontStyle,
              textDecoration: element.style.textDecoration,
              textAlign: element.style.textAlign,
              color: element.style.color
            }}
          >
            {element.content}
          </Typography>
        </Box>
      ));
  };
  
  if (loading && !currentDocument) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 2 }}>
      <EditorToolbar />
      
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {currentDocument?.name || 'PDF Editor'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Previous Page">
              <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
                <NavigateBeforeIcon />
              </IconButton>
            </Tooltip>
            
            <Typography sx={{ mx: 1 }}>
              Page {currentPage + 1} of {numPages || '?'}
            </Typography>
            
            <Tooltip title="Next Page">
              <IconButton onClick={handleNextPage} disabled={currentPage === numPages - 1}>
                <NavigateNextIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} disabled={zoom <= 0.5}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            
            <Typography sx={{ mx: 1 }}>
              {Math.round(zoom * 100)}%
            </Typography>
            
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} disabled={zoom >= 2.0}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            border: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
            minHeight: '500px',
            overflow: 'auto'
          }}
        >
          {currentDocument && (
            <>
              <Document
                file={currentDocument.url}
                onLoadSuccess={handleDocumentLoadSuccess}
                loading={<CircularProgress />}
              >
                <Page
                  pageNumber={currentPage + 1}
                  scale={zoom}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
              
              {/* Render text elements */}
              {renderTextElements()}
            </>
          )}
        </Box>
      </Paper>
      
      {/* Text Editor Dialog for editing existing text */}
      <Dialog 
        open={!!editingText} 
        onClose={handleCloseTextEditor}
        maxWidth="md"
        fullWidth
      >
        {editingText && (
          <EnhancedTextEditor 
            onClose={handleCloseTextEditor}
            initialText={editingText.content}
            position={editingText.position}
            editingId={editingText.id}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default PDFEditor;
