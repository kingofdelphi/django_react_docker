import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as LoginStates from '../../../store/login_info/login_states';

import { routesMap } from '../../../app';

import Button from '../../../components/button';
import Menu from '../../../components/menu';
import TimeZoneDetail from '../../dashboard/pages/timezone_detail';
import AddUser from './new_user';

import { addUser } from '../../../store/userlist/actionCreators';

import UserMenu from './usermenu';
import styles from './styles.module.scss';

class NavBar extends React.PureComponent {
  state = {
    timeZoneDetailModal: false,
    userAddModal: false,
    selectedItem: null, // the current tab selected, either dashboard or users
  };

  static getDerivedStateFromProps(props, state) {
    const guestRoutes = routesMap.non_auth.map(route => route.path);
    const mods = {};
    if (guestRoutes.includes(props.location.pathname)) {
      // on logout hide the modals
      Object.assign(mods, { userAddModal: false, timeZoneDetailModal: false });
    }
    const selectedItem = props.location.pathname.replace(/\//g, "");
    return { ...state, mods, selectedItem };
  }

  showTimeZoneDetailModal = () => {
    this.setState({
      timeZoneDetailModal: true,
    });
  };

  closeTimeZoneDetailModal = () => {
    this.setState({ timeZoneDetailModal: false });
  }

  getMenuItems() {
    const {
      loginInfo,
    } = this.props;
    return [
      {
        name: "Dashboard",
        key: 'dashboard',
        path: '/dashboard',
      },
      {
        name: loginInfo.role === 'normal_user' ? "Settings" : "Users",
        key: 'users',
        path: '/users',
      },
    ];
  }

  handleAdd = () => {
    const { selectedItem } = this.state;
    if (selectedItem === 'dashboard') {
      this.showTimeZoneDetailModal();
    } else {
      this.setState({ userAddModal: true });
    }
  }

  handleAddUser = (user) => {
    this.setState({ userAddModal: false });
    this.props.addUser(user);
  };

  render() {
    const {
      loginInfo,
    } = this.props;

    const { 
      timeZoneDetailModal,
      userAddModal,
      selectedItem,
    } = this.state;

    const isLoggedIn = loginInfo.loginStatus === LoginStates.LoggedIn;

    const menuItems = this.getMenuItems();

    const showPlus = isLoggedIn && (selectedItem === 'dashboard' || loginInfo.role !== 'normal_user');

    return (
      <div className={styles.main}>
        <div title="Go to homepage" onClick={() => this.props.history.push('/')} className={styles['app-title']}>TimeZone App</div>
          { 
            isLoggedIn && <Menu
            className={styles['nav-menu']}
            items={menuItems}
            selectedItem={selectedItem}
            keySelector={(item) => item.key}
            labelSelector={(item) => item.name}
            onChange={(item) => {
              this.setState({ selectedItem: item.key })
              this.props.history.push(item.path);
            }}
          />
          }
        <div className={styles['profile-actions']}>
          { isLoggedIn && showPlus && <Button className={styles["add-btn"]} title="Add" onClick={this.handleAdd}><i className='fa fa-plus' /></Button> }
          { isLoggedIn && <span className={styles['username']}><UserMenu username={loginInfo.username} /></span> }
        </div>
          {
            timeZoneDetailModal && ( 
              <TimeZoneDetail onCancel={this.closeTimeZoneDetailModal} /> 
            )
          }
          {
            userAddModal && ( 
              <AddUser onSubmit={this.handleAddUser} onCancel={() => this.setState({ userAddModal: false }) } /> 
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

const mapDispatchToProps = {
  addUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
