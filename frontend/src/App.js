import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import FormFiller from './pages/FormFiller';
import DocumentList from './pages/DocumentList';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/editor/:documentId?" element={<Editor />} />
          <Route path="/form-filler/:documentId?" element={<FormFiller />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
