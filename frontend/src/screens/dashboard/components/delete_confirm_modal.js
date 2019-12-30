import React from 'react';
import { connect } from "react-redux";

import ConfirmationModal from '../../../components/modal/confirmation';

import {
  deleteTimeZoneDetail,
} from '../../../store/timezones/actionCreators';


import {
  delete_timezone,
} from '../api/timezones';

import withAPIHelper from '../../../middleware/api/util';

class Confirm extends React.Component {
  handleDelete = () => {
    const { timezone } = this.props;
    this.props.makeApiCall(
      delete_timezone(
        timezone.id,
        () => {
          this.props.deleteTimeZoneDetail(this.getActionUser(), timezone);
          this.props.onCancel();
        },
        () => {
        },
      )
    );
  };

  getActionUser = () => {
    const {
      loginInfo,
      actionUser,
    } = this.props;
    return actionUser || loginInfo.username;
  };

  render() {
    return (
      <>
        <ConfirmationModal
          message="Are you sure you want to delete this ?"
          onSubmit={this.handleDelete}
          onCancel={this.props.onCancel}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({ 
  actionUser: state.actionUser,
  loginInfo: state.loginInfo,
});

const mapDispatchToProps = dispatch => ({
  deleteTimeZoneDetail: (username, timezone) => dispatch(deleteTimeZoneDetail(username, timezone)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withAPIHelper(Confirm));


