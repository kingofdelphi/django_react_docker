import React from 'react';
import { connect } from "react-redux";

import ConfirmationModal from '../../../components/modal/confirmation';
import Loading from '../../../components/loading';

import {
  deleteTimeZoneDetail,
} from '../../../store/timezones/actionCreators';


import {
  delete_timezone,
} from '../api/timezones';

import withAPIHelper from '../../../middleware/api/util';

class Confirm extends React.Component {
  state = {
    loading: false,
  };
  handleDelete = () => {
    const { timezone } = this.props;
    this.setState({ loading: true });
    this.props.makeApiCall(
      delete_timezone(
        timezone.id,
        () => {
          this.props.deleteTimeZoneDetail(timezone);
          this.props.onCancel();
        },
        () => {
          this.setState({ loading: false });
        },
      )
    );
  };

  render() {
    return (
      <>
        <ConfirmationModal
          message="Are you sure you want to delete this ?"
          onSubmit={this.handleDelete}
          onCancel={this.props.onCancel}
        />
        { this.state.loading && <Loading /> }
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  deleteTimeZoneDetail: (timezone) => dispatch(deleteTimeZoneDetail(timezone)),
});

export default connect(null, mapDispatchToProps)(withAPIHelper(Confirm));


