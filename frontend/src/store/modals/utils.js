import React from 'react';

import * as ModalTypes from './modal_types';

import LogoutPage from '../../screens/dashboard/pages/logout';
import TimeZoneDetailView from '../../screens/dashboard/pages/timezone_detail';

const ModalMap = {
  [ModalTypes.LogOut]: LogoutPage,
  [ModalTypes.TimeZoneDetail]: TimeZoneDetailView,
};

const getJsxFromModalConfig = (modal) => {
  if (!ModalMap[modal.type]) {
    throw new Error(
      `Undefined modal type ${modal.type}`
    );
  }
  const Component = ModalMap[modal.type];
  const data = modal.data;
  return (
    <Component key={modal.type} {...data} />
  );
};

export const map_modals_config_to_jsx = (modals) => {
  const modalComponents = modals.map(modal => getJsxFromModalConfig(modal));
  return modalComponents;
};
