import { configureStore } from '@reduxjs/toolkit';
import documentsReducer from './services/documentsSlice';
import editorReducer from './services/editorSlice';
import uiReducer from './services/uiSlice';

const store = configureStore({
  reducer: {
    documents: documentsReducer,
    editor: editorReducer,
    ui: uiReducer,
  },
});

export default store;
