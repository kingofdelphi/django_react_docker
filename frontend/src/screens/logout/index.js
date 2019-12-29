import React from 'react';
import { connect } from 'react-redux';

import { logoutUser } from '../../store/login_info/actionCreators';

import { 
  withRouter,
} from 'react-router-dom'

class Logout extends React.Component {
  componentDidMount() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.props.logoutUser();
    this.props.history.push('/');
  }

  render() {
    return (
      <></>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
});

export default withRouter(connect(null, mapDispatchToProps)(Logout));
