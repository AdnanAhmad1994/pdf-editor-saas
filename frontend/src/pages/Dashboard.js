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
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DescriptionIcon from '@mui/icons-material/Description';

import { fetchDocuments } from '../services/documentsSlice';
import FileUpload from '../components/FileUpload';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { documents, status } = useSelector(state => state.documents);
  const [recentDocuments, setRecentDocuments] = useState([]);
  
  // Fetch documents on component mount
  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);
  
  // Update recent documents when documents change
  useEffect(() => {
    if (documents && documents.length > 0) {
      // Sort by updated_at and take the most recent 5
      const sorted = [...documents].sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
      ).slice(0, 5);
      
      setRecentDocuments(sorted);
    }
  }, [documents]);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to PDF Editor SaaS
        </Typography>
        <Typography variant="body1" paragraph>
          A powerful tool for editing, merging, splitting, and filling PDF forms online.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            component={RouterLink} 
            to="/editor"
            startIcon={<EditIcon />}
          >
            Edit PDF
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            component={RouterLink} 
            to="/form-filler"
            startIcon={<TextFieldsIcon />}
          >
            Fill Form
          </Button>
        </Box>
      </Paper>
      
      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Edit PDF
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modify pages, add text, images, and more.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={RouterLink} 
                to="/editor"
                startIcon={<EditIcon />}
              >
                Start Editing
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fill Forms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete PDF forms with text, checkboxes, and more.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={RouterLink} 
                to="/form-filler"
                startIcon={<TextFieldsIcon />}
              >
                Fill Form
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Merge PDFs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Combine multiple PDF files into a single document.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={RouterLink} 
                to="/editor"
                startIcon={<MergeTypeIcon />}
              >
                Merge Files
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Split PDF
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Extract pages or split a PDF into multiple files.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={RouterLink} 
                to="/editor"
                startIcon={<ContentCutIcon />}
              >
                Split PDF
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Documents */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Recent Documents
        </Typography>
        <Button 
          variant="outlined" 
          component={RouterLink} 
          to="/documents"
        >
          View All
        </Button>
      </Box>
      <Paper sx={{ p: 0, mb: 4 }}>
        {status === 'loading' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : recentDocuments.length > 0 ? (
          <List>
            {recentDocuments.map((doc, index) => (
              <React.Fragment key={doc.id}>
                <ListItem 
                  button 
                  component={RouterLink} 
                  to={`/editor/${doc.id}`}
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
                  >
                    Edit
                  </Button>
                </ListItem>
                {index < recentDocuments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" paragraph>
              No recent documents found.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<FileUploadIcon />}
              component={RouterLink} 
              to="/editor"
            >
              Upload a PDF
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Upload New Document */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Upload New Document
        </Typography>
        <Typography variant="body1" paragraph>
          Upload a PDF file to start editing, filling forms, or performing other operations.
        </Typography>
        <FileUpload 
          onFilesSelected={(files) => {
            if (files && files.length > 0) {
              // Redirect to editor with the uploaded file
              // In a real app, you'd first upload the file to the server
              // and then redirect to the editor with the document ID
              window.location.href = '/editor';
            }
          }} 
          accept=".pdf" 
          multiple={false} 
        />
      </Paper>
    </Container>
  );
};

export default Dashboard;
