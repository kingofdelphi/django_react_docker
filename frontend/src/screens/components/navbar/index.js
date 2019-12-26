import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as LoginStates from '../../../store/login_info/login_states';

import Button from '../../../components/button';
import LogOut from '../../dashboard/pages/logout';
import TimeZoneDetail from '../../dashboard/pages/timezone_detail';

import styles from './styles.module.scss';

class NavBar extends React.PureComponent {
  state = {
    logoutModal: false,
    timeZoneDetailModal: false,
  };

  showTimeZoneDetailModal = () => {
    this.setState({
      timeZoneDetailModal: true,
    });
  };

  closeTimeZoneDetailModal = () => {
    this.setState({ timeZoneDetailModal: false });
  }

  showLogOutModal = () => {
    this.setState({
      logoutModal: true,
    });
  };

  closeLogOutModal = () => {
    this.setState({ logoutModal: false });
  }

  render() {
    const {
      loginInfo,
    } = this.props;

    const { 
      logoutModal, 
      timeZoneDetailModal,
    } = this.state;

    const isLoggedIn = loginInfo.loginStatus === LoginStates.LoggedIn;

    return (
      <div className={styles.main}>
        <div onClick={() => this.props.history.push('/')} className={styles['app-title']}>TimeZone App</div>
        <div className={styles['profile-actions']}>
          { isLoggedIn && <Button onClick={this.showTimeZoneDetailModal}>Add</Button> }
          { isLoggedIn && <span className={styles['username']}>{loginInfo.username}</span> }
          { isLoggedIn && <Button onClick={this.showLogOutModal}>LogOut</Button> }
        </div>
          { logoutModal && <LogOut onCancel={this.closeLogOutModal} /> }
          {
            timeZoneDetailModal && ( 
              <TimeZoneDetail onCancel={this.closeTimeZoneDetailModal} /> 
            )
          }
      </div>
    );
  }
}

const mapStateToProps = state => ({ 
  loginInfo: state.loginInfo
});

export default connect(mapStateToProps, null)(withRouter(NavBar));
