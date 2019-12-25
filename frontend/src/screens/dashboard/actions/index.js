import { addModal } from '../../../store/modals/actionCreators';
import * as ModalTypes from '../../../store/modals/modal_types';

export const showEditTimeZoneDetailModal = (time_zone_detail) => {
  return addModal(
    ModalTypes.TimeZoneDetail,
    time_zone_detail,
  )
};
