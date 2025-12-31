import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

export interface WeeklyQuest {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

interface WeeklyQuestsState {
  quests: WeeklyQuest[];
  weekStart: string;
  loading: boolean;
}

const initialState: WeeklyQuestsState = {
  quests: [],
  weekStart: '',
  loading: false,
};

export const weeklyQuestsSlice = createSlice({
  name: 'weeklyQuests',
  initialState,
  reducers: {
    setWeeklyQuests: (state, action: PayloadAction<{ quests: WeeklyQuest[]; weekStart: string }>) => {
      state.quests = action.payload.quests;
      state.weekStart = action.payload.weekStart;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    markQuestCompleted: (state, action: PayloadAction<string>) => {
      const quest = state.quests.find(q => q.id === action.payload);
      if (quest) {
        quest.completed = true;
      }
    },
  },
});

export const { setWeeklyQuests, setLoading, markQuestCompleted } = weeklyQuestsSlice.actions;
export const selectWeeklyQuests = (state: RootState) => state.weeklyQuests.quests;
export const selectWeekStart = (state: RootState) => state.weeklyQuests.weekStart;
export const selectWeeklyQuestsLoading = (state: RootState) => state.weeklyQuests.loading;

export default weeklyQuestsSlice.reducer;




