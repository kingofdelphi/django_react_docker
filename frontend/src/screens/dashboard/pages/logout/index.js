import React from 'react';
import { withRouter } from "react-router-dom";

import ConfirmationModal from '../../../../components/modal/confirmation';

class Logout extends React.Component {
  onSubmit = () => {
    this.props.onCancel();
    this.props.history.push('/logout');
  }

  render() {
    return (
      <ConfirmationModal
        message="Are you sure you want to log out ?"
        onSubmit={this.onSubmit}
        onCancel={this.props.onCancel}
      >
      </ConfirmationModal>
    );
  }
}

export default withRouter(Logout);
