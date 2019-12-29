import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser } from '../../store/login_info/actionCreators';

class Logout extends React.Component {
  state = {
    redirectToHome: false
  };
  componentDidMount() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.props.logoutUser();
    this.setState({
      redirectToHome: true
    });
  }

  render() {
    if (this.state.redirectToHome) {
      return (
        <Redirect to='/' />
      );
    }
    return (
      <></>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
});

export default connect(null, mapDispatchToProps)(Logout);
