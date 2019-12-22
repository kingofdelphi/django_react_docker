import { 
  ADD_MODAL,
  CLOSE_MODAL,
} from './actions';

export const addModal = (modal_info) => {
  return {
    type: ADD_MODAL,
    data: modal_info,
  }
};

// pop the topmost modal
export const closeModal = () => {
  return {
    type: CLOSE_MODAL,
  }
};

