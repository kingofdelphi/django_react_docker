import { 
  ADD_MODAL,
  CLOSE_MODAL,
} from './actions';

const modals = (state = [], action) => {
  if (action.type === ADD_MODAL) {
    state = [...state, action.data];
  }
  if (action.type === CLOSE_MODAL) {
    state = [...state];
    state.pop();
  }
  return state;
};

export default modals;
