import { combineReducers } from '@reduxjs/toolkit';
import globalReducer from './global.store';
import appReducer from './app.store';
import proposalReducer from './proposal.store';

const rootReducer = combineReducers({
  global: globalReducer,
  app: appReducer,
  proposal: proposalReducer,
});

export default rootReducer;
