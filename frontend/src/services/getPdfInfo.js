// Add getPdfInfo async thunk to editorSlice.js
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
