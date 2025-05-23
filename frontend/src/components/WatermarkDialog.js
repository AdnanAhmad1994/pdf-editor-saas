import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';

const WatermarkDialog = ({ open, onClose, onConfirm }) => {
  const [watermarkText, setWatermarkText] = useState('');
  
  const handleConfirm = () => {
    onConfirm(watermarkText);
    setWatermarkText('');
  };
  
  const handleCancel = () => {
    onClose();
    setWatermarkText('');
  };
  
  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Add Watermark</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Enter the text to use as a watermark on all pages of the PDF.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="watermark"
            label="Watermark Text"
            type="text"
            fullWidth
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="primary" 
          variant="contained"
          disabled={!watermarkText.trim()}
        >
          Add Watermark
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WatermarkDialog;
