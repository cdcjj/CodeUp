import { combineReducers } from 'redux';
import auth from './loginReducer';
import profile from './profileReducer';
import events from './events';
import users from './userListReducer';
import search from './searchReducer';
import chat from './chatReducer';

const codeUpApp = combineReducers({
  auth,
  events,
  profile,
  users,
  search,
  chat,
});

export default codeUpApp;
