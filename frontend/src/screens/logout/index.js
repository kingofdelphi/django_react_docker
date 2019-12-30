import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser } from '../../store/login_info/actionCreators';

class Logout extends React.PureComponent {
  constructor(props) {
    super(props);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  componentDidMount() {
    this.props.logoutUser();
  }

  render() {
    return (
      <Redirect to='/' />
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
});

export default connect(null, mapDispatchToProps)(Logout);
