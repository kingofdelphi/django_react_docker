import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as LoginStates from '../../../store/login_info/login_states';

import Button from '../../../components/button';
import LogOut from '../../dashboard/pages/logout';
import TimeZoneDetail from '../../dashboard/pages/timezone_detail';

import { setTimeZoneListFilter } from '../../../store/timezones/actionCreators';
import Search from '../search';

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

  handleFilterChange = (event) => {
    this.props.setTimeZoneListFilter(event.target.value);
  }

  render() {
    const {
      loginInfo,
      timeZoneFilter,
    } = this.props;

    const { 
      logoutModal, 
      timeZoneDetailModal,
    } = this.state;

    const isLoggedIn = loginInfo.loginStatus === LoginStates.LoggedIn;

    return (
      <div className={styles.main}>
        <div title="Go to homepage" onClick={() => this.props.history.push('/')} className={styles['app-title']}>TimeZone App</div>
        <div className={styles['timezone-actions']}>
          { isLoggedIn && <Button title="Add new time zone" onClick={this.showTimeZoneDetailModal}><i className='fa fa-plus' /></Button> }
          { isLoggedIn && ( 
            <Search 
              value={timeZoneFilter} 
              placeholder="Filter by name"
              onChange={this.handleFilterChange} 
            />
          )
          }
        </div>
        <div className={styles['profile-actions']}>
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
  loginInfo: state.loginInfo,
  timeZoneFilter: state.timeZoneFilter,
});

const mapDispatchToProps = dispatch => ({ 
  setTimeZoneListFilter: (value) => dispatch(setTimeZoneListFilter(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
