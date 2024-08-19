import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BreadcrumbItem {
  label: string;
  command: () => void;
}

const initialState: BreadcrumbItem[] = [];

const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      return action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<BreadcrumbItem>) => {
      state.push(action.payload);
    },
    clearBreadcrumbs: () => {
      return [];
    },
    addBreadcrumbIfNotExists: (state, action: PayloadAction<BreadcrumbItem>) => {
      const exists = state.some(breadcrumb => breadcrumb.label === action.payload.label);
      if (!exists) {
        state.push(action.payload);
      }
    }
  }
});

export const { setBreadcrumbs, addBreadcrumb, clearBreadcrumbs, addBreadcrumbIfNotExists } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
