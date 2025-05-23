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
  TextField,
  CircularProgress,
  Divider,
  Alert,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import { 
  setCurrentFile, 
  clearCurrentFile, 
  getPdfInfo, 
  getFormFields,
  fillForm,
  clearResult
} from '../services/editorSlice';
import { showSnackbar } from '../services/uiSlice';
import FileUpload from '../components/FileUpload';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FormFiller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { documentId } = useParams();
  
  const { currentFile, pdfInfo, formFields, result, status, operation, error } = useSelector(state => state.editor);
  
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [formValues, setFormValues] = useState({});
  const [scale, setScale] = useState(1.0);
  
  // Handle file upload
  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      dispatch(setCurrentFile(file));
      dispatch(getPdfInfo(file));
      dispatch(getFormFields(file));
    }
  };
  
  // Handle document loading success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  
  // Handle form field change
  const handleFormFieldChange = (fieldName, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  // Handle form submission
  const handleSubmitForm = () => {
    if (currentFile && Object.keys(formValues).length > 0) {
      dispatch(fillForm({
        file: currentFile,
        formData: formValues
      }));
    }
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
    setFormValues({});
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };
  
  // Render form field based on type
  const renderFormField = (fieldName, fieldInfo) => {
    const value = formValues[fieldName] !== undefined ? formValues[fieldName] : fieldInfo.value;
    
    switch (fieldInfo.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={fieldName}
            value={value || ''}
            onChange={(e) => handleFormFieldChange(fieldName, e.target.value)}
            margin="normal"
          />
        );
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => handleFormFieldChange(fieldName, e.target.checked)}
              />
            }
            label={fieldName}
          />
        );
      case 'radio':
        // This is a simplified example - in a real app, you'd need to handle radio groups properly
        return (
          <FormControlLabel
            control={
              <Radio
                checked={Boolean(value)}
                onChange={(e) => handleFormFieldChange(fieldName, e.target.checked)}
              />
            }
            label={fieldName}
          />
        );
      case 'choice':
        // This assumes choices would be provided in the field info
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel id={`select-label-${fieldName}`}>{fieldName}</InputLabel>
            <Select
              labelId={`select-label-${fieldName}`}
              value={value || ''}
              label={fieldName}
              onChange={(e) => handleFormFieldChange(fieldName, e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {/* In a real app, you'd map through available choices */}
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return (
          <TextField
            fullWidth
            label={fieldName}
            value={value || ''}
            onChange={(e) => handleFormFieldChange(fieldName, e.target.value)}
            margin="normal"
          />
        );
    }
  };
  
  // Effect to handle result
  useEffect(() => {
    if (result) {
      dispatch(showSnackbar({
        message: 'Form filled successfully. Click to download the result.',
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
          PDF Form Filler
        </Typography>
        <Typography variant="body1" paragraph>
          Upload a PDF form to fill out and save.
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
              {operation === 'info' ? 'Loading PDF...' : operation === 'formFields' ? 'Extracting form fields...' : 'Processing...'}
            </Typography>
          </Box>
        )}
        
        {currentFile && status !== 'loading' && (
          <Grid container spacing={3}>
            {/* PDF Preview */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  PDF Preview
                </Typography>
                
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
                      renderAnnotationLayer={true}
                    />
                  </Document>
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => handlePageChange(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2">
                    Page {pageNumber} of {numPages}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => handlePageChange(pageNumber + 1)}
                    disabled={pageNumber >= numPages}
                  >
                    Next
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            {/* Form Fields */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Form Fields
                </Typography>
                
                {formFields && Object.keys(formFields).length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <form>
                      {Object.entries(formFields).map(([fieldName, fieldInfo]) => (
                        <Box key={fieldName} sx={{ mb: 2 }}>
                          {renderFormField(fieldName, fieldInfo)}
                        </Box>
                      ))}
                      
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleSubmitForm}
                          disabled={Object.keys(formValues).length === 0}
                        >
                          Fill Form
                        </Button>
                      </Box>
                    </form>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                    {pdfInfo && !pdfInfo.has_form ? (
                      <Alert severity="info" sx={{ width: '100%' }}>
                        This PDF does not contain any form fields. Please upload a PDF with form fields.
                      </Alert>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        No form fields detected. Please upload a PDF with form fields.
                      </Typography>
                    )}
                  </Box>
                )}
                
                {result && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Form Filled Successfully
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SaveIcon />}
                      onClick={handleDownloadResult}
                      sx={{ mt: 1 }}
                    >
                      Download Filled Form
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default FormFiller;
