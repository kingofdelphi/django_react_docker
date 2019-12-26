import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ConfirmationModal from '../../../../components/modal/confirmation';

import { closeModal } from '../../../../store/modals/actionCreators';

class Logout extends React.Component {
  onSubmit = () => {
    // need to chain, only change history after modal is closed, otherwise react unmount throws error
    // to reproduce the output: set interval of the setTimeout to low value like 1000
    this.props.close();
    this.props.history.push('/logout');
  }

  render() {
    return (
      <ConfirmationModal
        message="Are you sure you want to log out ?"
        onSubmit={this.onSubmit}
      >
      </ConfirmationModal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeModal()),
});

export default withRouter(connect(null, mapDispatchToProps)(Logout));

