import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for API calls
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async ({ ownerId, folderId } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (ownerId) params.owner_id = ownerId;
      if (folderId) params.folder_id = folderId;
      
      const response = await axios.get('/api/documents', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDocument = createAsyncThunk(
  'documents/createDocument',
  async ({ file, name, ownerId, folderId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('owner_id', ownerId);
      if (folderId) formData.append('folder_id', folderId);
      
      const response = await axios.post('/api/documents', formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async ({ documentId, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/documents/${documentId}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/documents/${documentId}`);
      return documentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addDocumentVersion = createAsyncThunk(
  'documents/addDocumentVersion',
  async ({ documentId, file, userId, comment }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      if (comment) formData.append('comment', comment);
      
      const response = await axios.post(`/api/documents/${documentId}/versions`, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  documents: [],
  currentDocument: null,
  documentVersions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Slice
const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDocuments
      .addCase(fetchDocuments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // createDocument
      .addCase(createDocument.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents.push(action.payload);
        state.currentDocument = action.payload;
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // updateDocument
      .addCase(updateDocument.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // deleteDocument
      .addCase(deleteDocument.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = state.documents.filter(doc => doc.id !== action.payload);
        if (state.currentDocument?.id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // addDocumentVersion
      .addCase(addDocumentVersion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addDocumentVersion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { document, version_id } = action.payload;
        const index = state.documents.findIndex(doc => doc.id === document.id);
        if (index !== -1) {
          state.documents[index] = document;
        }
        if (state.currentDocument?.id === document.id) {
          state.currentDocument = document;
        }
      })
      .addCase(addDocumentVersion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCurrentDocument, clearCurrentDocument } = documentsSlice.actions;

export default documentsSlice.reducer;
