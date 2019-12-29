import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as LoginStates from '../../../store/login_info/login_states';

import Button from '../../../components/button';
import TimeZoneDetail from '../../dashboard/pages/timezone_detail';

import UserMenu from './usermenu';
import styles from './styles.module.scss';

class NavBar extends React.PureComponent {
  state = {
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

  render() {
    const {
      loginInfo,
    } = this.props;

    const { 
      timeZoneDetailModal,
    } = this.state;

    const isLoggedIn = loginInfo.loginStatus === LoginStates.LoggedIn;

    return (
      <div className={styles.main}>
        <div title="Go to homepage" onClick={() => this.props.history.push('/')} className={styles['app-title']}>TimeZone App</div>
        <div className={styles['profile-actions']}>
          { isLoggedIn && <Button className={styles["add-timezone"]} title="Add new time zone" onClick={this.showTimeZoneDetailModal}><i className='fa fa-plus' /></Button> }
          { isLoggedIn && <span className={styles['username']}><UserMenu username={loginInfo.username} /></span> }
        </div>
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
  loginInfo: state.loginInfo,
  timeZoneFilter: state.timeZoneFilter,
});

const mapDispatchToProps = dispatch => ({ 
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
