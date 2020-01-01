import React from 'react';
import { connect } from 'react-redux';

import ConfirmationModal from '../../../../components/modal/confirmation';

import { logoutUser } from '../../../../store/login_info/actionCreators';

class Logout extends React.PureComponent {
  onSubmit = () => {
    this.props.logoutUser();
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

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
});

export default connect(null, mapDispatchToProps)(Logout);
