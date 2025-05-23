// Complete editorSlice.js with fixed structure
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API endpoints
const API_URL = 'https://8000-iwxzazbdw95tzqk2qcd1z-b90c3a69.manusvm.computer';

// Async thunks
export const compressPdf = createAsyncThunk(
  'editor/compressPdf',
  async (file, { rejectWithValue }) => {
    try {
      // Create form data to upload the PDF file
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/api/pdf/compress`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const extractText = createAsyncThunk(
  'editor/extractText',
  async ({ documentId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/extract-text`, {
        document_id: documentId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rotatePages = createAsyncThunk(
  'editor/rotatePages',
  async ({ documentId, pages, angle }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/rotate-pages`, {
        document_id: documentId,
        pages: pages,
        angle: angle
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const extractPages = createAsyncThunk(
  'editor/extractPages',
  async ({ documentId, pages }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/extract-pages`, {
        document_id: documentId,
        pages: pages
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const splitPdf = createAsyncThunk(
  'editor/splitPdf',
  async (file, { rejectWithValue }) => {
    try {
      // Create form data to upload the PDF file
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/api/pdf/split`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPdfInfo = createAsyncThunk(
  'editor/getPdfInfo',
  async (file, { rejectWithValue }) => {
    try {
      // Create form data to upload the PDF file
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/api/pdf/info`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchDocument = createAsyncThunk(
  'editor/fetchDocument',
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/documents/${documentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTextToPdf = createAsyncThunk(
  'editor/addTextToPdf',
  async ({ documentId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/text`, {
        document_id: documentId,
        text: text
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTextInPdf = createAsyncThunk(
  'editor/updateTextInPdf',
  async ({ documentId, textId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/pdf/text/${textId}`, {
        document_id: documentId,
        text: text
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addHighlightToPdf = createAsyncThunk(
  'editor/addHighlightToPdf',
  async ({ documentId, highlight }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/highlight`, {
        document_id: documentId,
        highlight: highlight
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addSignatureToPdf = createAsyncThunk(
  'editor/addSignatureToPdf',
  async ({ documentId, signature }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/signature`, {
        document_id: documentId,
        signature: signature
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addDrawingToPdf = createAsyncThunk(
  'editor/addDrawingToPdf',
  async ({ documentId, drawing }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/drawing`, {
        document_id: documentId,
        drawing: drawing
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTableToPdf = createAsyncThunk(
  'editor/addTableToPdf',
  async ({ documentId, table }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/table`, {
        document_id: documentId,
        table: table
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchAndReplaceText = createAsyncThunk(
  'editor/searchAndReplaceText',
  async ({ documentId, searchText, replaceText, replaceAll }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/search-replace`, {
        document_id: documentId,
        search_text: searchText,
        replace_text: replaceText,
        replace_all: replaceAll
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addRedactionToPdf = createAsyncThunk(
  'editor/addRedactionToPdf',
  async ({ documentId, redaction }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/redaction`, {
        document_id: documentId,
        redaction: redaction
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMarkToPdf = createAsyncThunk(
  'editor/addMarkToPdf',
  async ({ documentId, mark }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pdf/mark`, {
        document_id: documentId,
        mark: mark
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addImageToPdf = createAsyncThunk(
  'editor/addImageToPdf',
  async ({ documentId, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('document_id', documentId);
      formData.append('image', image.file);
      formData.append('position_x', image.position.x);
      formData.append('position_y', image.position.y);
      formData.append('width', image.width);
      formData.append('height', image.height);
      
      const response = await axios.post(`${API_URL}/api/pdf/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  currentDocument: null,
  currentFile: null,
  pages: [],
  textElements: [],
  highlightElements: [],
  signatureElements: [],
  drawingElements: [],
  tableElements: [],
  redactionElements: [],
  markElements: [],
  imageElements: [],
  loading: false,
  error: null,
  activeToolbar: 'text', // 'text', 'draw', 'highlight', 'signature', etc.
  selectedElement: null,
  zoom: 1.0,
  currentPage: 0
};

// Slice
const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setActiveToolbar: (state, action) => {
      state.activeToolbar = action.payload;
    },
    setSelectedElement: (state, action) => {
      state.selectedElement = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
    clearEditor: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Extract Text
      .addCase(extractText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extractText.fulfilled, (state, action) => {
        state.loading = false;
        state.extractedText = action.payload.text;
      })
      .addCase(extractText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to extract text';
      })
      
      // Rotate Pages
      .addCase(rotatePages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rotatePages.fulfilled, (state, action) => {
        state.loading = false;
        // Handle rotate pages result if needed
      })
      .addCase(rotatePages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to rotate pages';
      })
      
      // Extract Pages
      .addCase(extractPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extractPages.fulfilled, (state, action) => {
        state.loading = false;
        // Handle extract pages result if needed
      })
      .addCase(extractPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to extract pages';
      })
      
      // Split PDF
      .addCase(splitPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(splitPdf.fulfilled, (state, action) => {
        state.loading = false;
        // Handle split PDF result if needed
      })
      .addCase(splitPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to split PDF';
      })
      
      // Get PDF info
      .addCase(getPdfInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPdfInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDocument = action.payload;
        state.pages = action.payload.pages || [];
        state.textElements = action.payload.text_elements || [];
        state.highlightElements = action.payload.highlight_elements || [];
        state.signatureElements = action.payload.signature_elements || [];
        state.drawingElements = action.payload.drawing_elements || [];
        state.tableElements = action.payload.table_elements || [];
        state.redactionElements = action.payload.redaction_elements || [];
        state.markElements = action.payload.mark_elements || [];
        state.imageElements = action.payload.image_elements || [];
      })
      .addCase(getPdfInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get PDF info';
      })
      // Fetch document
      .addCase(fetchDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDocument = action.payload;
        state.pages = action.payload.pages || [];
        state.textElements = action.payload.text_elements || [];
        state.highlightElements = action.payload.highlight_elements || [];
        state.signatureElements = action.payload.signature_elements || [];
        state.drawingElements = action.payload.drawing_elements || [];
        state.tableElements = action.payload.table_elements || [];
        state.redactionElements = action.payload.redaction_elements || [];
        state.markElements = action.payload.mark_elements || [];
        state.imageElements = action.payload.image_elements || [];
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch document';
      })
      
      // Add text
      .addCase(addTextToPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTextToPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.textElements.push(action.payload);
      })
      .addCase(addTextToPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add text';
      })
      
      // Update text
      .addCase(updateTextInPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTextInPdf.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.textElements.findIndex(el => el.id === action.payload.id);
        if (index !== -1) {
          state.textElements[index] = action.payload;
        }
      })
      .addCase(updateTextInPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update text';
      })
      
      // Add highlight
      .addCase(addHighlightToPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHighlightToPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.highlightElements.push(action.payload);
      })
      .addCase(addHighlightToPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add highlight';
      })
      
      // Add signature
      .addCase(addSignatureToPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSignatureToPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.signatureElements.push(action.payload);
      })
      .addCase(addSignatureToPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add signature';
      })
      
      // Add drawing
      .addCase(addDrawingToPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDrawingToPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.drawingElements.push(action.payload);
      })
      .addCase(addDrawingToPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add drawing';
      })
      
      // Add table
      .addCase(addTableToPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTableToPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.tableElements.push(action.payload);
      })
      .addCase(addTableToPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add table';
      })
      
      // Search and replace
      .addCase(searchAndReplaceText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAndReplaceText.fulfilled, (state, action) => {
        state.loading = false;
        // Update text elements with replaced content
        if (action.payload.updated_elements) {
          action.payload.updated_elements.forEach(updatedElement => {
            const index = state.textElements.findIndex(el => el.id === updatedElement.id);
            if (index !== -1) {
              state.textElements[index] = updatedElement;
            }
          });
        }
      })
      .addCase(searchAndReplaceText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search and replace text';
      })
      
      // Add redaction
      .addCase(addRedactionToPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRedactionToPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.redactionElements.push(action.payload);
      })
      .addCase(addRedactionToPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add redaction';
      })
      
      // Add mark
      .addCase(addMarkToPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMarkToPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.markElements.push(action.payload);
      })
      .addCase(addMarkToPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add mark';
      })
      
      // Add image
      .addCase(addImageToPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImageToPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.imageElements.push(action.payload);
      })
      .addCase(addImageToPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add image';
      });
  }
});

export const { setActiveToolbar, setSelectedElement, setZoom, setCurrentPage, clearEditor, setCurrentFile } = editorSlice.actions;

export default editorSlice.reducer;
