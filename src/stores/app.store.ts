import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  mlcTokenPrice: number;
  mlcTokenUsdChange: number;
  bnbTokenPrice: number;
  lpTokenPrice: number;
  mlcPoolApy: number;
  lpPoolApy: number;
  gasPrice: {
    fast: number;
    standard: number;
    slow: number;
  };
}
const initialState: State = {
  mlcTokenPrice: 0,
  mlcTokenUsdChange: 0,
  bnbTokenPrice: 0,
  lpTokenPrice: 0,
  mlcPoolApy: 0,
  lpPoolApy: 0,
  gasPrice: {
    fast: 23,
    standard: 24,
    slow: 30,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPriceForToken(state, action: PayloadAction<Partial<State>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setPriceForToken } = appSlice.actions;

export default appSlice.reducer;
