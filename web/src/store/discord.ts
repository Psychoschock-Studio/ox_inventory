import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

export interface DiscordServer {
  id: string;
  link: string;
  title: string;
  description: string;
  members: string;
}

interface DiscordState {
  servers: DiscordServer[];
  joinButtonLabel: string;
  loading: boolean;
}

const initialState: DiscordState = {
  servers: [],
  joinButtonLabel: 'Join the server',
  loading: false,
};

export const discordSlice = createSlice({
  name: 'discord',
  initialState,
  reducers: {
    setDiscordServers: (state, action: PayloadAction<{ servers: DiscordServer[]; joinButtonLabel?: string }>) => {
      state.servers = action.payload.servers;
      if (action.payload.joinButtonLabel) {
        state.joinButtonLabel = action.payload.joinButtonLabel;
      }
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setDiscordServers, setLoading } = discordSlice.actions;
export const selectDiscordServers = (state: RootState) => state.discord.servers;
export const selectDiscordJoinButtonLabel = (state: RootState) => state.discord.joinButtonLabel;
export const selectDiscordLoading = (state: RootState) => state.discord.loading;

export default discordSlice.reducer;

