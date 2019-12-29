import React from 'react';
import { Redirect } from "react-router-dom";

import ConfirmationModal from '../../../../components/modal/confirmation';

class Logout extends React.Component {
  state = {
    exit: false,
  }

  onSubmit = () => {
    this.setState({ exit: true });
  }

  render() {
    if (this.state.exit) {
      return (
        <Redirect to='/logout' />
      );
    }
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

export default Logout;
