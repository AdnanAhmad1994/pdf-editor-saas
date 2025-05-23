# Frontend Enhancement Implementation

Based on our analysis of PDFfiller's interface and features, I've identified the key components that need to be implemented or enhanced in our current frontend to match PDFfiller's functionality.

## Text Editing Enhancements

```javascript
// Enhanced text editing component
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Toolbar, 
  Select, 
  MenuItem, 
  TextField, 
  IconButton, 
  Tooltip,
  Divider,
  Popover,
  Grid
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import LineWeightIcon from '@mui/icons-material/LineWeight';

const TextEditor = ({ onTextChange, initialText = '', onFormatChange }) => {
  const [text, setText] = useState(initialText);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(14);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [textColor, setTextColor] = useState('#000000');
  
  const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Helvetica'];
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72];
  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'
  ];
  
  const handleTextChange = (e) => {
    setText(e.target.value);
    onTextChange && onTextChange(e.target.value);
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
    
    onFormatChange && onFormatChange({
      fontFamily: property === 'fontFamily' ? value : fontFamily,
      fontSize: property === 'fontSize' ? value : fontSize,
      bold: property === 'bold' ? value : bold,
      italic: property === 'italic' ? value : italic,
      underline: property === 'underline' ? value : underline,
      alignment: property === 'alignment' ? value : alignment,
      textColor: property === 'textColor' ? value : textColor
    });
  };
  
  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
  };
  
  const handleColorClose = () => {
    setColorAnchorEl(null);
  };
  
  const colorOpen = Boolean(colorAnchorEl);
  
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Toolbar variant="dense" disableGutters sx={{ mb: 1 }}>
        <Select
          value={fontFamily}
          onChange={(e) => handleFormatChange('fontFamily', e.target.value)}
          size="small"
          sx={{ width: 150, mr: 1 }}
        >
          {fonts.map(font => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </MenuItem>
          ))}
        </Select>
        
        <Select
          value={fontSize}
          onChange={(e) => handleFormatChange('fontSize', e.target.value)}
          size="small"
          sx={{ width: 70, mr: 1 }}
        >
          {fontSizes.map(size => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <Tooltip title="Bold">
          <IconButton 
            onClick={() => handleFormatChange('bold', !bold)}
            color={bold ? 'primary' : 'default'}
          >
            <FormatBoldIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Italic">
          <IconButton 
            onClick={() => handleFormatChange('italic', !italic)}
            color={italic ? 'primary' : 'default'}
          >
            <FormatItalicIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Underline">
          <IconButton 
            onClick={() => handleFormatChange('underline', !underline)}
            color={underline ? 'primary' : 'default'}
          >
            <FormatUnderlinedIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <Tooltip title="Align Left">
          <IconButton 
            onClick={() => handleFormatChange('alignment', 'left')}
            color={alignment === 'left' ? 'primary' : 'default'}
          >
            <FormatAlignLeftIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Align Center">
          <IconButton 
            onClick={() => handleFormatChange('alignment', 'center')}
            color={alignment === 'center' ? 'primary' : 'default'}
          >
            <FormatAlignCenterIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Align Right">
          <IconButton 
            onClick={() => handleFormatChange('alignment', 'right')}
            color={alignment === 'right' ? 'primary' : 'default'}
          >
            <FormatAlignRightIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <Tooltip title="Text Color">
          <IconButton onClick={handleColorClick}>
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
          <Box sx={{ p: 2 }}>
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
    </Paper>
  );
};

export default TextEditor;
```

## Signature Tool Implementation

```javascript
// Signature component
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Tabs, 
  Tab, 
  TextField,
  IconButton,
  Divider
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const SignatureTool = ({ onSave, onCancel }) => {
  const [tabValue, setTabValue] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedSignature, setTypedSignature] = useState('');
  const [signatureFont, setSignatureFont] = useState('Dancing Script');
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;
      
      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context.lineCap = 'round';
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      contextRef.current = context;
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [tabValue]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  const saveSignature = () => {
    if (tabValue === 0) {
      // Draw signature
      const canvas = canvasRef.current;
      const signatureDataUrl = canvas.toDataURL('image/png');
      onSave && onSave(signatureDataUrl, 'draw');
    } else if (tabValue === 1) {
      // Type signature
      if (typedSignature.trim()) {
        // In a real implementation, we would render the typed signature to a canvas
        // and convert it to an image. For simplicity, we're just passing the text.
        onSave && onSave(typedSignature, 'type', signatureFont);
      }
    } else if (tabValue === 2) {
      // Upload signature - this would be handled by the file input
      // The actual implementation would read the file and convert it to a data URL
    }
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onSave && onSave(e.target.result, 'upload');
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        Add Your Signature
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Draw" />
        <Tab label="Type" />
        <Tab label="Upload" />
      </Tabs>
      
      {tabValue === 0 && (
        <Box>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: 1,
              height: 200,
              backgroundColor: '#f9f9f9',
              mb: 2
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseLeave={finishDrawing}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />}
            onClick={clearCanvas}
            sx={{ mr: 1 }}
          >
            Clear
          </Button>
        </Box>
      )}
      
      {tabValue === 1 && (
        <Box>
          <TextField
            fullWidth
            label="Type your signature"
            value={typedSignature}
            onChange={(e) => setTypedSignature(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              style: {
                fontFamily: signatureFont,
                fontSize: '24px'
              }
            }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Select font style:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['Dancing Script', 'Pacifico', 'Satisfy', 'Caveat'].map(font => (
                <Box
                  key={font}
                  onClick={() => setSignatureFont(font)}
                  sx={{
                    p: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    cursor: 'pointer',
                    backgroundColor: signatureFont === font ? '#e3f2fd' : 'transparent',
                    fontFamily: font,
                    fontSize: '18px'
                  }}
                >
                  Signature
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
      
      {tabValue === 2 && (
        <Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<FileUploadIcon />}
            fullWidth
            sx={{ height: 100, mb: 2 }}
          >
            Upload Signature Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileUpload}
            />
          </Button>
          <Typography variant="body2" color="textSecondary">
            Supported formats: JPG, PNG, GIF
          </Typography>
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />}
          onClick={saveSignature}
          disabled={(tabValue === 0 && !isDrawing) || (tabValue === 1 && !typedSignature.trim())}
        >
          Save Signature
        </Button>
      </Box>
    </Paper>
  );
};

export default SignatureTool;
```

## Page Thumbnail Navigation

```javascript
// Enhanced page thumbnail navigation
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';

const PageThumbnailNavigation = ({ 
  pages, 
  currentPage, 
  onPageSelect, 
  onPageReorder,
  onPageDelete,
  onPageRotate,
  onPageDuplicate,
  onAddPage
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  
  const handleMenuOpen = (event, pageIndex) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedPage(pageIndex);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const reorderedPages = Array.from(pages);
    const [removed] = reorderedPages.splice(result.source.index, 1);
    reorderedPages.splice(result.destination.index, 0, removed);
    
    onPageReorder && onPageReorder(reorderedPages);
  };
  
  const handlePageDelete = () => {
    onPageDelete && onPageDelete(selectedPage);
    handleMenuClose();
  };
  
  const handlePageRotate = () => {
    onPageRotate && onPageRotate(selectedPage);
    handleMenuClose();
  };
  
  const handlePageDuplicate = () => {
    onPageDuplicate && onPageDuplicate(selectedPage);
    handleMenuClose();
  };
  
  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Pages ({pages.length})
        </Typography>
        <IconButton color="primary" onClick={onAddPage}>
          <AddIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="page-thumbnails">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ minHeight: '100%' }}
              >
                {pages.map((page, index) => (
                  <Draggable key={page.id} draggableId={page.id} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          mb: 2,
                          position: 'relative',
                          border: currentPage === index ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                        onClick={() => onPageSelect && onPageSelect(index)}
                      >
                        <Box
                          component="img"
                          src={page.thumbnail}
                          alt={`Page ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                        />
                        
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            padding: '4px 8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography variant="body2">
                            Page {index + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{ color: 'white' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, index);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePageRotate}>
          <ListItemIcon>
            <RotateRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rotate</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePageDuplicate}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handlePageDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default PageThumbnailNavigation;
```

## Table Insertion Tool

```javascript
// Table insertion component
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider
} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import BorderClearIcon from '@mui/icons-material/BorderClear';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

const TableInsertionTool = ({ onInsert, onCancel }) => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [headerRow, setHeaderRow] = useState(true);
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [cellPadding, setCellPadding] = useState(5);
  
  const handleRowsChange = (event, newValue) => {
    setRows(newValue);
  };
  
  const handleColumnsChange = (event, newValue) => {
    setColumns(newValue);
  };
  
  const handleInsert = () => {
    onInsert && onInsert({
      rows,
      columns,
      headerRow,
      style: {
        borderStyle,
        borderWidth,
        borderColor,
        backgroundColor,
        cellPadding
      }
    });
  };
  
  // Preview table based on current settings
  const renderTablePreview = () => {
    const tableRows = [];
    
    for (let i = 0; i < Math.min(rows, 5); i++) {
      const cells = [];
      
      for (let j = 0; j < Math.min(columns, 5); j++) {
        cells.push(
          <Box
            key={`cell-${i}-${j}`}
            component="td"
            sx={{
              border: `${borderWidth}px ${borderStyle} ${borderColor}`,
              padding: `${cellPadding}px`,
              backgroundColor: i === 0 && headerRow ? '#f5f5f5' : backgroundColor,
              fontWeight: i === 0 && headerRow ? 'bold' : 'normal',
              textAlign: 'center',
              minWidth: '30px',
              height: '30px'
            }}
          >
            {i === 0 && headerRow ? `H${j+1}` : `${i+1},${j+1}`}
          </Box>
        );
      }
      
      tableRows.push(
        <Box component="tr" key={`row-${i}`}>
          {cells}
        </Box>
      );
    }
    
    return (
      <Box
        component="table"
        sx={{
          borderCollapse: 'collapse',
          width: '100%',
          mb: 2
        }}
      >
        <Box component="tbody">
          {tableRows}
        </Box>
      </Box>
    );
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Insert Table
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Rows: {rows}</Typography>
          <Slider
            value={rows}
            onChange={handleRowsChange}
            min={1}
            max={20}
            valueLabelDisplay="auto"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Columns: {columns}</Typography>
          <Slider
            value={columns}
            onChange={handleColumnsChange}
            min={1}
            max={10}
            valueLabelDisplay="auto"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Border Style</InputLabel>
            <Select
              value={borderStyle}
              onChange={(e) => setBorderStyle(e.target.value)}
              label="Border Style"
            >
              <MenuItem value="solid">Solid</MenuItem>
              <MenuItem value="dashed">Dashed</MenuItem>
              <MenuItem value="dotted">Dotted</MenuItem>
              <MenuItem value="double">Double</MenuItem>
              <MenuItem value="none">None</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Border Width (px)"
            type="number"
            value={borderWidth}
            onChange={(e) => setBorderWidth(Number(e.target.value))}
            InputProps={{ inputProps: { min: 0, max: 10 } }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Cell Padding (px)"
            type="number"
            value={cellPadding}
            onChange={(e) => setCellPadding(Number(e.target.value))}
            InputProps={{ inputProps: { min: 0, max: 20 } }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }}>Border Color:</Typography>
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              style={{ width: '40px', height: '40px' }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }}>Background:</Typography>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{ width: '40px', height: '40px' }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl>
            <Typography component="label" htmlFor="header-row-checkbox">
              <input
                id="header-row-checkbox"
                type="checkbox"
                checked={headerRow}
                onChange={(e) => setHeaderRow(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Include header row
            </Typography>
          </FormControl>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Preview
      </Typography>
      
      <Box sx={{ border: '1px dashed #ccc', p: 2, mb: 3, overflowX: 'auto' }}>
        {renderTablePreview()}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          startIcon={<TableChartIcon />}
          onClick={handleInsert}
        >
          Insert Table
        </Button>
      </Box>
    </Paper>
  );
};

export default TableInsertionTool;
```

These components can be integrated into our existing PDF Editor SaaS application to enhance its functionality and match the features observed in PDFfiller. Additional backend API endpoints will need to be implemented to support these new frontend features.
