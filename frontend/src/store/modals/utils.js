import React from 'react';

import * as ModalTypes from './modal_types';

import LogoutPage from '../../screens/dashboard/pages/logout';
import TimeZoneDetailView from '../../screens/dashboard/pages/timezone_detail';

export const map_modals_config_to_jsx = (modals) => {
  const modalComponents = modals.map(modal => {
    if (modal.type === ModalTypes.LogOut) {
      return (
        <LogoutPage key={modal} />
      );
    }
    if (modal.type === ModalTypes.TimeZoneDetail) {
      return (
        <TimeZoneDetailView
          key={modal}
          detail={modal.data}
        />
      );
    }
    throw new Error(
      `Undefined modal type ${modal.type}`
    );
  });
  return modalComponents;
};
