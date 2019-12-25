import { addModal } from '../../../../store/modals/actionCreators';
import * as ModalTypes from '../../../../store/modals/modal_types';

export const showLogOutModal = () => {
  return addModal(ModalTypes.LogOut);
};

export const showAddNewTimeZoneDetailModal = () => {
  return addModal(
    ModalTypes.TimeZoneDetail,
  )
};

