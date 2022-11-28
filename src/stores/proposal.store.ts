import { createSlice } from '@reduxjs/toolkit';

interface State {
  proposalData: any;
}

const initialState: State = {
  proposalData: {},
};

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    currentProposal: (state, action) => {
      state.proposalData = action.payload;
    },
  },
});

export const { currentProposal } = proposalSlice.actions;

export default proposalSlice.reducer;
