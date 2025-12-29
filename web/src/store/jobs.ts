import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

export interface Job {
  id: string;
  name: string;
  description: string;
  image?: string;
  event?: string;
  eventServer?: string;
  args?: Record<string, any>;
}

export interface JobCategory {
  title: string;
  jobs: Job[];
}

interface JobsState {
  categories: JobCategory[];
  joinButtonLabel: string;
  loading: boolean;
}

const initialState: JobsState = {
  categories: [],
  joinButtonLabel: 'Join the activity',
  loading: false,
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<{ categories: JobCategory[]; joinButtonLabel?: string }>) => {
      state.categories = action.payload.categories;
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

export const { setJobs, setLoading } = jobsSlice.actions;
export const selectJobCategories = (state: RootState) => state.jobs.categories;
export const selectJobsJoinButtonLabel = (state: RootState) => state.jobs.joinButtonLabel;
export const selectJobsLoading = (state: RootState) => state.jobs.loading;

export default jobsSlice.reducer;

