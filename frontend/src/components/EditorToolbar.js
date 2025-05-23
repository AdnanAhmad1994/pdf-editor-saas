import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Dialog
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import HighlightIcon from '@mui/icons-material/Highlight';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CreateIcon from '@mui/icons-material/Create';
import TableChartIcon from '@mui/icons-material/TableChart';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveToolbar } from '../services/editorSlice';
import EnhancedTextEditor from './EnhancedTextEditor';

const EditorToolbar = () => {
  const dispatch = useDispatch();
  const activeToolbar = useSelector(state => state.editor.activeToolbar);
  const [textEditorOpen, setTextEditorOpen] = useState(false);
  
  const handleToolSelect = (tool) => {
    dispatch(setActiveToolbar(tool));
    
    // Open specific dialogs based on tool selection
    if (tool === 'text') {
      setTextEditorOpen(true);
    }
  };
  
  const handleCloseTextEditor = () => {
    setTextEditorOpen(false);
  };
  
  return (
    <>
      <Paper elevation={2} sx={{ p: 1, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
          PDF Editing Tools
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Grid container spacing={1}>
          <Grid item>
            <Tooltip title="Add Text">
              <IconButton 
                color={activeToolbar === 'text' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('text')}
              >
                <TextFieldsIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Highlight Text">
              <IconButton 
                color={activeToolbar === 'highlight' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('highlight')}
              >
                <HighlightIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Add Signature">
              <IconButton 
                color={activeToolbar === 'signature' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('signature')}
              >
                <BorderColorIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Draw">
              <IconButton 
                color={activeToolbar === 'draw' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('draw')}
              >
                <CreateIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Insert Table">
              <IconButton 
                color={activeToolbar === 'table' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('table')}
              >
                <TableChartIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Search & Replace">
              <IconButton 
                color={activeToolbar === 'search' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('search')}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Insert Image">
              <IconButton 
                color={activeToolbar === 'image' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('image')}
              >
                <ImageIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Add Check Mark">
              <IconButton 
                color={activeToolbar === 'check' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('check')}
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Add Cross Mark">
              <IconButton 
                color={activeToolbar === 'cross' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('cross')}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Redaction">
              <IconButton 
                color={activeToolbar === 'redaction' ? 'primary' : 'default'}
                onClick={() => handleToolSelect('redaction')}
              >
                <FormatColorFillIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Text Editor Dialog */}
      <Dialog 
        open={textEditorOpen} 
        onClose={handleCloseTextEditor}
        maxWidth="md"
        fullWidth
      >
        <EnhancedTextEditor onClose={handleCloseTextEditor} />
      </Dialog>
    </>
  );
};

export default EditorToolbar;
