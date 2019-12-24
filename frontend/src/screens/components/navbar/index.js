import React from 'react';
import { connect } from 'react-redux'

import {
  showLogOutModal,
} from './actions';

import * as LoginStates from '../../../store/login_info/login_states';

import Button from '../../../components/button';

import styles from './styles.module.scss';

class NavBar extends React.PureComponent {
  render() {
    const {
      loginInfo,
    } = this.props;

    const isLoggedIn = loginInfo.loginStatus === LoginStates.LoggedIn;

    return (
      <div className={styles.main}>
        <div className={styles['app-title']}>TimeZone App</div>
        <div className={styles['profile-actions']}>
          { isLoggedIn && <Button onClick={this.props.showLogOutModal}>LogOut</Button> }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ 
  loginInfo: state.loginInfo
});

const mapDispatchToProps = dispatch => ({ 
  showLogOutModal: () => dispatch(showLogOutModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
