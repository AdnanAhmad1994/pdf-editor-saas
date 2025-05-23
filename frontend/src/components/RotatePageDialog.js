import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

const RotatePageDialog = ({ open, onClose, onConfirm, numPages }) => {
  const [rotations, setRotations] = useState({});
  
  const handleRotationChange = (pageNum, angle) => {
    setRotations(prev => ({
      ...prev,
      [pageNum]: angle
    }));
  };
  
  const handleConfirm = () => {
    onConfirm(rotations);
    setRotations({});
  };
  
  const handleCancel = () => {
    onClose();
    setRotations({});
  };
  
  // Generate array of page numbers
  const pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1);
  
  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Rotate Pages</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Select the pages you want to rotate and choose the rotation angle.
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {pageNumbers.map(pageNum => (
              <Grid item xs={12} sm={6} md={4} key={pageNum}>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Page {pageNum}
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id={`rotation-label-${pageNum}`}>Rotation</InputLabel>
                    <Select
                      labelId={`rotation-label-${pageNum}`}
                      id={`rotation-${pageNum}`}
                      value={rotations[pageNum] || 0}
                      label="Rotation"
                      onChange={(e) => handleRotationChange(pageNum, e.target.value)}
                    >
                      <MenuItem value={0}>No Rotation</MenuItem>
                      <MenuItem value={90}>90° Clockwise</MenuItem>
                      <MenuItem value={180}>180°</MenuItem>
                      <MenuItem value={270}>90° Counter-Clockwise</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            ))}
          </Grid>
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
          disabled={Object.keys(rotations).length === 0}
        >
          Apply Rotations
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RotatePageDialog;
