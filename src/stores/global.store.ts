import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  loading: boolean;
  errorCode: string;
  listTopStake: any;
  isReloadData: boolean;
}
const initialState: State = {
  loading: false,
  errorCode: '',
  listTopStake: [],
  isReloadData: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalState(state, action: PayloadAction<Partial<State>>) {
      Object.assign(state, action.payload);
    },
    setListTopStake: (state, action) => {
      state.listTopStake = action.payload;
    },
    setIsReloadData: state => {
      state.isReloadData = !state.isReloadData;
    },
  },
});

export const { setGlobalState, setListTopStake, setIsReloadData } = globalSlice.actions;

export default globalSlice.reducer;
