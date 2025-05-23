import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  isLoading: false,
  snackbar: {
    open: false,
    message: '',
    severity: 'info', // 'success' | 'info' | 'warning' | 'error'
  },
  dialog: {
    open: false,
    title: '',
    content: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
  },
  drawer: {
    open: false,
    content: null,
  },
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    showDialog: (state, action) => {
      state.dialog = {
        open: true,
        title: action.payload.title,
        content: action.payload.content,
        confirmText: action.payload.confirmText || 'Confirm',
        cancelText: action.payload.cancelText || 'Cancel',
        onConfirm: action.payload.onConfirm,
        onCancel: action.payload.onCancel,
      };
    },
    hideDialog: (state) => {
      state.dialog.open = false;
    },
    showDrawer: (state, action) => {
      state.drawer = {
        open: true,
        content: action.payload.content,
      };
    },
    hideDrawer: (state) => {
      state.drawer.open = false;
    },
  },
});

export const {
  setLoading,
  showSnackbar,
  hideSnackbar,
  showDialog,
  hideDialog,
  showDrawer,
  hideDrawer,
} = uiSlice.actions;

export default uiSlice.reducer;
