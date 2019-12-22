import React from 'react';

import * as ModalTypes from './modal_types';

import LogoutPage from '../screens/dashboard/pages/logout';
import AddNewTimeZonePage from '../screens/dashboard/pages/add_new_timezone';

export const map_modals_config_to_jsx = (modals) => {
  const modalComponents = modals.map(modal => {
    if (modal === ModalTypes.LogOut) {
      return (
        <LogoutPage key={modal} />
      );
    }
    return (
      <AddNewTimeZonePage key={modal} />
    );
  });
  return modalComponents;
};
