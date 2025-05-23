import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  IconButton,
  Divider,
  Grid,
  Tooltip,
  Popover
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { useDispatch, useSelector } from 'react-redux';
import { addTextToPdf, updateTextInPdf } from '../services/editorSlice';

const EnhancedTextEditor = ({ onClose, initialText = '', position = null, editingId = null }) => {
  const [text, setText] = useState(initialText);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(14);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [textColor, setTextColor] = useState('#000000');
  
  const dispatch = useDispatch();
  const currentDocument = useSelector(state => state.editor.currentDocument);
  
  const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Helvetica'];
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72];
  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'
  ];
  
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  
  const handleFormatChange = (property, value) => {
    switch(property) {
      case 'fontFamily':
        setFontFamily(value);
        break;
      case 'fontSize':
        setFontSize(value);
        break;
      case 'bold':
        setBold(value);
        break;
      case 'italic':
        setItalic(value);
        break;
      case 'underline':
        setUnderline(value);
        break;
      case 'alignment':
        setAlignment(value);
        break;
      case 'textColor':
        setTextColor(value);
        setColorAnchorEl(null);
        break;
      default:
        break;
    }
  };
  
  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
  };
  
  const handleColorClose = () => {
    setColorAnchorEl(null);
  };
  
  const handleSave = () => {
    const textElement = {
      type: 'text',
      content: text,
      style: {
        fontFamily,
        fontSize,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
        textAlign: alignment,
        color: textColor
      },
      position: position || { x: 100, y: 100 }
    };
    
    if (editingId) {
      dispatch(updateTextInPdf({ documentId: currentDocument.id, textId: editingId, text: textElement }));
    } else {
      dispatch(addTextToPdf({ documentId: currentDocument.id, text: textElement }));
    }
    
    onClose && onClose();
  };
  
  const colorOpen = Boolean(colorAnchorEl);
  
  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {editingId ? 'Edit Text' : 'Add Text to PDF'}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Toolbar variant="dense" disableGutters sx={{ mb: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel id="font-family-label">Font</InputLabel>
            <Select
              labelId="font-family-label"
              value={fontFamily}
              onChange={(e) => handleFormatChange('fontFamily', e.target.value)}
              label="Font"
            >
              {fonts.map(font => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ width: 80, mr: 1 }}>
            <InputLabel id="font-size-label">Size</InputLabel>
            <Select
              labelId="font-size-label"
              value={fontSize}
              onChange={(e) => handleFormatChange('fontSize', e.target.value)}
              label="Size"
            >
              {fontSizes.map(size => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Tooltip title="Bold">
            <IconButton 
              onClick={() => handleFormatChange('bold', !bold)}
              color={bold ? 'primary' : 'default'}
              size="small"
            >
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Italic">
            <IconButton 
              onClick={() => handleFormatChange('italic', !italic)}
              color={italic ? 'primary' : 'default'}
              size="small"
            >
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Underline">
            <IconButton 
              onClick={() => handleFormatChange('underline', !underline)}
              color={underline ? 'primary' : 'default'}
              size="small"
            >
              <FormatUnderlinedIcon />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Tooltip title="Align Left">
            <IconButton 
              onClick={() => handleFormatChange('alignment', 'left')}
              color={alignment === 'left' ? 'primary' : 'default'}
              size="small"
            >
              <FormatAlignLeftIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Align Center">
            <IconButton 
              onClick={() => handleFormatChange('alignment', 'center')}
              color={alignment === 'center' ? 'primary' : 'default'}
              size="small"
            >
              <FormatAlignCenterIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Align Right">
            <IconButton 
              onClick={() => handleFormatChange('alignment', 'right')}
              color={alignment === 'right' ? 'primary' : 'default'}
              size="small"
            >
              <FormatAlignRightIcon />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Tooltip title="Text Color">
            <IconButton onClick={handleColorClick} size="small">
              <FormatColorTextIcon style={{ color: textColor }} />
            </IconButton>
          </Tooltip>
          
          <Popover
            open={colorOpen}
            anchorEl={colorAnchorEl}
            onClose={handleColorClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ p: 1 }}>
              <Grid container spacing={1}>
                {colors.map(color => (
                  <Grid item key={color}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: color,
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => handleFormatChange('textColor', color)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Popover>
        </Toolbar>
        
        <TextField
          multiline
          fullWidth
          minRows={4}
          value={text}
          onChange={handleTextChange}
          variant="outlined"
          placeholder="Enter your text here..."
          InputProps={{
            style: {
              fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight: bold ? 'bold' : 'normal',
              fontStyle: italic ? 'italic' : 'normal',
              textDecoration: underline ? 'underline' : 'none',
              textAlign: alignment,
              color: textColor
            }
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!text.trim()}
        >
          {editingId ? 'Update' : 'Add Text'}
        </Button>
      </Box>
    </Paper>
  );
};

// For compatibility with Material-UI
const Toolbar = ({ children, ...props }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', ...props.sx }}>
      {children}
    </Box>
  );
};

export default EnhancedTextEditor;
