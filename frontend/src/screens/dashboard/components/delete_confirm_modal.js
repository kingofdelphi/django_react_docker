import React from 'react';
import { connect } from "react-redux";

import ConfirmationModal from '../../../components/modal/confirmation';

import {
  deleteTimeZoneDetail,
} from '../../../store/timezones/actionCreators';


import {
  delete_timezone,
} from '../api/timezones';

class Confirm extends React.Component {
  handleDelete = () => {
    const { timezone } = this.props;
    delete_timezone(
      timezone.id,
      () => {
        this.props.deleteTimeZoneDetail(timezone);
        this.props.onCancel();
      },
      () => {
        alert('cant delete');
      },
    );
  };

  render() {
    return (
      <ConfirmationModal
        message="Are you sure you want to delete this ?"
        onSubmit={this.handleDelete}
        onCancel={this.props.onCancel}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  deleteTimeZoneDetail: (timezone) => dispatch(deleteTimeZoneDetail(timezone)),
});

export default connect(null, mapDispatchToProps)(Confirm);


