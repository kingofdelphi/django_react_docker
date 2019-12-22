import { addModal } from '../../../store/modals/actionCreators';
import * as ModalTypes from '../../../store/modals/modal_types';

export const showAddNewTimeZoneDetailModal = () => {
  return addModal(
    ModalTypes.TimeZoneDetail,
  )
};

export const showEditTimeZoneDetailModal = (time_zone_detail) => {
  return addModal(
    ModalTypes.TimeZoneDetail,
    time_zone_detail,
  )
};

export const showLogOutModal = () => {
  return addModal(ModalTypes.LogOut);
};
