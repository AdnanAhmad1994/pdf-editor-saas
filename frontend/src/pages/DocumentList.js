import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { 
  fetchDocuments, 
  createDocument, 
  updateDocument, 
  deleteDocument 
} from '../services/documentsSlice';
import { showSnackbar, showDialog } from '../services/uiSlice';
import FileUpload from '../components/FileUpload';

const DocumentList = () => {
  const dispatch = useDispatch();
  const { documents, status, error } = useSelector(state => state.documents);
  
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [currentFolder, setCurrentFolder] = useState('root');
  
  // Fetch documents on component mount and when folder changes
  useEffect(() => {
    dispatch(fetchDocuments({ folder_id: currentFolder === 'root' ? null : currentFolder }));
  }, [dispatch, currentFolder]);
  
  // Handle menu open
  const handleMenuOpen = (event, document) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle document delete
  const handleDeleteDocument = () => {
    if (selectedDocument) {
      dispatch(showDialog({
        title: 'Confirm Delete',
        content: `Are you sure you want to delete "${selectedDocument.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => {
          dispatch(deleteDocument(selectedDocument.id))
            .unwrap()
            .then(() => {
              dispatch(showSnackbar({
                message: 'Document deleted successfully',
                severity: 'success'
              }));
            })
            .catch(err => {
              dispatch(showSnackbar({
                message: `Error deleting document: ${err.message}`,
                severity: 'error'
              }));
            });
        }
      }));
    }
    handleMenuClose();
  };
  
  // Handle document rename
  const handleRenameClick = () => {
    if (selectedDocument) {
      setNewName(selectedDocument.name);
      setShowRenameDialog(true);
    }
    handleMenuClose();
  };
  
  // Handle rename confirm
  const handleRenameConfirm = () => {
    if (selectedDocument && newName.trim()) {
      dispatch(updateDocument({
        documentId: selectedDocument.id,
        updates: { name: newName.trim() }
      }))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({
            message: 'Document renamed successfully',
            severity: 'success'
          }));
          setShowRenameDialog(false);
        })
        .catch(err => {
          dispatch(showSnackbar({
            message: `Error renaming document: ${err.message}`,
            severity: 'error'
          }));
        });
    }
  };
  
  // Handle file upload
  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // In a real app, you'd get the user ID from authentication
      const userId = 'user123';
      
      dispatch(createDocument({
        file,
        name: file.name,
        ownerId: userId,
        folderId: currentFolder === 'root' ? null : currentFolder
      }))
        .unwrap()
        .then(() => {
          dispatch(showSnackbar({
            message: 'Document uploaded successfully',
            severity: 'success'
          }));
          setShowUploadDialog(false);
        })
        .catch(err => {
          dispatch(showSnackbar({
            message: `Error uploading document: ${err.message}`,
            severity: 'error'
          }));
        });
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            My Documents
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<FileUploadIcon />}
            onClick={() => setShowUploadDialog(true)}
          >
            Upload Document
          </Button>
        </Box>
        
        {/* Breadcrumb navigation for folders - simplified for now */}
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="text" 
            startIcon={<FolderIcon />}
            onClick={() => setCurrentFolder('root')}
            color={currentFolder === 'root' ? 'primary' : 'inherit'}
          >
            Root
          </Button>
          {/* In a real app, you'd show the folder hierarchy here */}
        </Box>
        
        {status === 'loading' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : status === 'failed' ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="error">
              Error loading documents: {error?.message || 'Unknown error'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => dispatch(fetchDocuments())}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        ) : documents.length > 0 ? (
          <List>
            {documents.map((doc, index) => (
              <React.Fragment key={doc.id}>
                <ListItem 
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon>
                    <PictureAsPdfIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doc.name} 
                    secondary={`Last modified: ${new Date(doc.updated_at).toLocaleString()}`} 
                  />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    component={RouterLink} 
                    to={`/editor/${doc.id}`}
                    sx={{ mr: 1 }}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <IconButton 
                    edge="end" 
                    aria-label="more"
                    onClick={(e) => handleMenuOpen(e, doc)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItem>
                {index < documents.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" paragraph>
              No documents found in this folder.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<FileUploadIcon />}
              onClick={() => setShowUploadDialog(true)}
            >
              Upload a Document
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Document Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
        <MenuItem onClick={handleDeleteDocument}>Delete</MenuItem>
      </Menu>
      
      {/* Upload Dialog */}
      <Dialog 
        open={showUploadDialog} 
        onClose={() => setShowUploadDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FileUpload 
              onFilesSelected={handleFileUpload} 
              accept=".pdf" 
              multiple={false} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Rename Dialog */}
      <Dialog 
        open={showRenameDialog} 
        onClose={() => setShowRenameDialog(false)}
      >
        <DialogTitle>Rename Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            type="text"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRenameDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRenameConfirm}
            variant="contained"
            disabled={!newName.trim()}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentList;
