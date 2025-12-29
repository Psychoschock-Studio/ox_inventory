import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

export interface Command {
  id: string;
  description: string;
  usage?: string;
}

export interface CommandCategory {
  title: string;
  commands: Command[];
}

interface CommandsState {
  categories: CommandCategory[];
  favorites: string[];
  loading: boolean;
}

const initialState: CommandsState = {
  categories: [],
  favorites: [],
  loading: false,
};

export const commandsSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    setCommands: (state, action: PayloadAction<{ categories: CommandCategory[]; favorites?: string[] }>) => {
      state.categories = action.payload.categories;
      state.favorites = action.payload.favorites || [];
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.favorites.indexOf(id);
      if (idx === -1) {
        state.favorites.push(id);
      } else {
        state.favorites.splice(idx, 1);
      }
    },
  },
});

export const { setCommands, setLoading, toggleFavorite } = commandsSlice.actions;
export const selectCommandCategories = (state: RootState) => state.commands.categories;
export const selectFavorites = (state: RootState) => state.commands.favorites;
export const selectCommandsLoading = (state: RootState) => state.commands.loading;

export default commandsSlice.reducer;

