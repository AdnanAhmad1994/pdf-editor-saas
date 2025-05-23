import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput } from '@mui/material';

const ExtractPagesDialog = ({ open, onClose, onConfirm, numPages }) => {
  const [pageRanges, setPageRanges] = useState('');
  
  const handleConfirm = () => {
    onConfirm(pageRanges);
    setPageRanges('');
  };
  
  const handleCancel = () => {
    onClose();
    setPageRanges('');
  };
  
  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Extract Pages</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Enter the page numbers or ranges to extract (e.g., 1,3,5-7,10).
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            This PDF has {numPages} pages.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="pages"
            label="Page Numbers"
            type="text"
            fullWidth
            value={pageRanges}
            onChange={(e) => setPageRanges(e.target.value)}
            placeholder="e.g., 1,3,5-7,10"
            helperText="Separate individual pages with commas, use hyphens for ranges"
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
          disabled={!pageRanges.trim()}
        >
          Extract Pages
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtractPagesDialog;
