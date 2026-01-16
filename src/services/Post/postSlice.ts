
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PostsLocalState {
  selectedPostId: number | null;
}

const initialState: PostsLocalState = {
  selectedPostId: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    selectPost: (state, action: PayloadAction<number | null>) => {
      state.selectedPostId = action.payload;
    },
  },
});

export const { selectPost } = postsSlice.actions;
export default postsSlice.reducer;
