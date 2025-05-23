import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Tabs, 
  Tab, 
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CompressIcon from '@mui/icons-material/Compress';
import WatermarkIcon from '@mui/icons-material/BrandingWatermark';

import { 
  setCurrentFile, 
  clearCurrentFile, 
  getPdfInfo, 
  mergePdfs,
  splitPdf,
  extractPages,
  rotatePages,
  extractText,
  compressPdf,
  addWatermark,
  clearResult
} from '../services/editorSlice';
import { showSnackbar } from '../services/uiSlice';
import FileUpload from '../components/FileUpload';
import PageThumbnails from '../components/PageThumbnails';
import RotatePageDialog from '../components/RotatePageDialog';
import ExtractPagesDialog from '../components/ExtractPagesDialog';
import WatermarkDialog from '../components/WatermarkDialog';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Editor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { documentId } = useParams();
  
  const { currentFile, pdfInfo, result, status, operation, error } = useSelector(state => state.editor);
  
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [showRotateDialog, setShowRotateDialog] = useState(false);
  const [showExtractDialog, setShowExtractDialog] = useState(false);
  const [showWatermarkDialog, setShowWatermarkDialog] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [scale, setScale] = useState(1.0);
  
  // Handle file upload
  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      dispatch(setCurrentFile(file));
      dispatch(getPdfInfo(file));
    }
  };
  
  // Handle document loading success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle page change
  const handlePageChange = (pageNum) => {
    setPageNumber(pageNum);
  };
  
  // Handle page selection
  const handlePageSelection = (pageNum) => {
    const index = selectedPages.indexOf(pageNum);
    if (index === -1) {
      setSelectedPages([...selectedPages, pageNum]);
    } else {
      setSelectedPages(selectedPages.filter(p => p !== pageNum));
    }
  };
  
  // Handle merge PDFs
  const handleMergePdfs = () => {
    // This would typically open a dialog to select multiple files
    // For simplicity, we'll just show a message
    dispatch(showSnackbar({
      message: 'Please select multiple PDF files to merge',
      severity: 'info'
    }));
  };
  
  // Handle split PDF
  const handleSplitPdf = () => {
    if (currentFile) {
      dispatch(splitPdf(currentFile));
    }
  };
  
  // Handle extract pages
  const handleExtractPages = () => {
    setShowExtractDialog(true);
  };
  
  // Confirm extract pages
  const confirmExtractPages = (pages) => {
    if (currentFile && pages) {
      dispatch(extractPages({
        file: currentFile,
        pages: pages
      }));
    }
    setShowExtractDialog(false);
  };
  
  // Handle rotate pages
  const handleRotatePages = () => {
    setShowRotateDialog(true);
  };
  
  // Confirm rotate pages
  const confirmRotatePages = (rotations) => {
    if (currentFile && Object.keys(rotations).length > 0) {
      dispatch(rotatePages({
        file: currentFile,
        rotations: rotations
      }));
    }
    setShowRotateDialog(false);
  };
  
  // Handle extract text
  const handleExtractText = () => {
    if (currentFile) {
      dispatch(extractText({
        file: currentFile
      }));
    }
  };
  
  // Handle compress PDF
  const handleCompressPdf = () => {
    if (currentFile) {
      dispatch(compressPdf(currentFile));
    }
  };
  
  // Handle add watermark
  const handleAddWatermark = () => {
    setShowWatermarkDialog(true);
  };
  
  // Confirm add watermark
  const confirmAddWatermark = (text) => {
    if (currentFile && text) {
      dispatch(addWatermark({
        file: currentFile,
        watermarkText: text
      }));
    }
    setShowWatermarkDialog(false);
  };
  
  // Handle download result
  const handleDownloadResult = () => {
    if (result) {
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      dispatch(clearResult());
    }
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };
  
  // Reset zoom
  const handleResetZoom = () => {
    setScale(1.0);
  };
  
  // Clear current file
  const handleClearFile = () => {
    dispatch(clearCurrentFile());
    setNumPages(null);
    setPageNumber(1);
    setSelectedPages([]);
  };
  
  // Effect to handle result
  useEffect(() => {
    if (result) {
      dispatch(showSnackbar({
        message: 'Operation completed successfully. Click to download the result.',
        severity: 'success'
      }));
    }
  }, [result, dispatch]);
  
  // Effect to handle errors
  useEffect(() => {
    if (error) {
      dispatch(showSnackbar({
        message: `Error: ${error.message || 'An error occurred'}`,
        severity: 'error'
      }));
    }
  }, [error, dispatch]);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          PDF Editor
        </Typography>
        <Typography variant="body1" paragraph>
          Upload a PDF file to edit, merge, split, or perform other operations.
        </Typography>
        
        {!currentFile && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <FileUpload onFilesSelected={handleFileUpload} accept=".pdf" multiple={false} />
          </Box>
        )}
        
        {status === 'loading' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              {operation === 'info' ? 'Loading PDF...' : 'Processing...'}
            </Typography>
          </Box>
        )}
        
        {currentFile && status !== 'loading' && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="editor tabs">
                <Tab label="View" />
                <Tab label="Edit" />
                <Tab label="Tools" />
              </Tabs>
            </Box>
            
            {/* View Tab */}
            {tabValue === 0 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
                      <Typography variant="h6" gutterBottom>
                        Pages
                      </Typography>
                      {numPages && (
                        <PageThumbnails 
                          file={currentFile}
                          numPages={numPages}
                          currentPage={pageNumber}
                          selectedPages={selectedPages}
                          onPageClick={handlePageChange}
                          onPageSelect={handlePageSelection}
                        />
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Paper sx={{ p: 2, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                        <Button 
                          variant="outlined" 
                          onClick={handleZoomOut}
                          disabled={scale <= 0.5}
                        >
                          Zoom Out
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={handleResetZoom}
                        >
                          Reset ({Math.round(scale * 100)}%)
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={handleZoomIn}
                          disabled={scale >= 3.0}
                        >
                          Zoom In
                        </Button>
                      </Box>
                      
                      <Box sx={{ overflow: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Document
                          file={currentFile}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={<CircularProgress />}
                          error={<Alert severity="error">Failed to load PDF</Alert>}
                        >
                          <Page 
                            pageNumber={pageNumber} 
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </Document>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          Page {pageNumber} of {numPages}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Edit Tab */}
            {tabValue === 1 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Edit Options
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Button 
                          variant="contained" 
                          startIcon={<RotateRightIcon />}
                          onClick={handleRotatePages}
                          fullWidth
                        >
                          Rotate Pages
                        </Button>
                        <Button 
                          variant="contained" 
                          startIcon={<ContentCutIcon />}
                          onClick={handleExtractPages}
                          fullWidth
                        >
                          Extract Pages
                        </Button>
                        <Button 
                          variant="contained" 
                          startIcon={<TextFieldsIcon />}
                          onClick={handleExtractText}
                          fullWidth
                        >
                          Extract Text
                        </Button>
                        <Button 
                          variant="contained" 
                          startIcon={<WatermarkIcon />}
                          onClick={handleAddWatermark}
                          fullWidth
                        >
                          Add Watermark
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Paper sx={{ p: 2, minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          PDF Information
                        </Typography>
                        {pdfInfo && (
                          <Box>
                            <Typography variant="body1">
                              Pages: {pdfInfo.page_count}
                            </Typography>
                            <Typography variant="body1">
                              Has Form: {pdfInfo.has_form ? 'Yes' : 'No'}
                            </Typography>
                            <Typography variant="body1">
                              Encrypted: {pdfInfo.is_encrypted ? 'Yes' : 'No'}
                            </Typography>
                            {pdfInfo.metadata && (
                              <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                  Metadata
                                </Typography>
                                {Object.entries(pdfInfo.metadata).map(([key, value]) => (
                                  <Typography key={key} variant="body1">
                                    {key}: {value}
                                  </Typography>
                                ))}
                              </>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Tools Tab */}
            {tabValue === 2 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        PDF Tools
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Button 
                          variant="contained" 
                          startIcon={<MergeTypeIcon />}
                          onClick={handleMergePdfs}
                          fullWidth
                        >
                          Merge PDFs
                        </Button>
                        <Button 
                          variant="contained" 
                          startIcon={<ContentCutIcon />}
                          onClick={handleSplitPdf}
                          fullWidth
                        >
                          Split PDF
                        </Button>
                        <Button 
                          variant="contained" 
                          startIcon={<CompressIcon />}
                          onClick={handleCompressPdf}
                          fullWidth
                        >
                          Compress PDF
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Paper sx={{ p: 2, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      {result ? (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" gutterBottom>
                            Operation Completed Successfully
                          </Typography>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<SaveIcon />}
                            onClick={handleDownloadResult}
                            sx={{ mt: 2 }}
                          >
                            Download {result.filename}
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          Select a tool from the left panel to perform operations on your PDF.
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<DeleteIcon />}
                onClick={handleClearFile}
              >
                Clear File
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<FileUploadIcon />}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                Upload New File
              </Button>
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ display: 'none' }}
              />
            </Box>
          </>
        )}
      </Paper>
      
      {/* Dialogs */}
      {showRotateDialog && (
        <RotatePageDialog
          open={showRotateDialog}
          onClose={() => setShowRotateDialog(false)}
          onConfirm={confirmRotatePages}
          numPages={numPages}
        />
      )}
      
      {showExtractDialog && (
        <ExtractPagesDialog
          open={showExtractDialog}
          onClose={() => setShowExtractDialog(false)}
          onConfirm={confirmExtractPages}
          numPages={numPages}
        />
      )}
      
      {showWatermarkDialog && (
        <WatermarkDialog
          open={showWatermarkDialog}
          onClose={() => setShowWatermarkDialog(false)}
          onConfirm={confirmAddWatermark}
        />
      )}
    </Container>
  );
};

export default Editor;
