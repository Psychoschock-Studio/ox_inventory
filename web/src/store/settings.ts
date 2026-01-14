import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

export interface Setting {
  id: string;
  label: string;
  type: 'checkbox' | 'slider' | 'select' | 'color' | 'button';
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: any; label: string }>;
  action?: string;
}

export interface SettingCategory {
  id: string;
  title: string;
  settings: Setting[];
}

interface SettingsState {
  categories: SettingCategory[];
  values: { [categoryId: string]: { [settingId: string]: any } };
  loading: boolean;
}

const initialState: SettingsState = {
  categories: [],
  values: {},
  loading: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<{ categories: SettingCategory[]; values?: { [categoryId: string]: { [settingId: string]: any } } }>) => {
      state.categories = action.payload.categories;
      if (action.payload.values) {
        state.values = action.payload.values;
      }
      state.loading = false;
    },
    setSettingValue: (state, action: PayloadAction<{ categoryId: string; settingId: string; value: any }>) => {
      if (!state.values[action.payload.categoryId]) {
        state.values[action.payload.categoryId] = {};
      }
      state.values[action.payload.categoryId][action.payload.settingId] = action.payload.value;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSettings, setSettingValue, setLoading } = settingsSlice.actions;
export const selectSettingsCategories = (state: RootState) => state.settings.categories;
export const selectSettingsValues = (state: RootState) => state.settings.values;
export const selectSettingsLoading = (state: RootState) => state.settings.loading;

export default settingsSlice.reducer;





