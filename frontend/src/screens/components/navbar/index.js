import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as LoginStates from '../../../store/login_info/login_states';

import Button from '../../../components/button';
import Menu from '../../../components/menu';
import TimeZoneDetail from '../../dashboard/pages/timezone_detail';
import AddUser from './new_user';

import UserMenu from './usermenu';
import styles from './styles.module.scss';

class NavBar extends React.PureComponent {
  state = {
    timeZoneDetailModal: false,
    userAddModal: false,
    selectedItem: this.props.location.pathname.replace(/\//g, ""),
  };

  componentDidUpdate() {
    this.setState({ selectedItem: this.props.location.pathname.replace(/\//g, "") });
  }

  showTimeZoneDetailModal = () => {
    this.setState({
      timeZoneDetailModal: true,
    });
  };

  closeTimeZoneDetailModal = () => {
    this.setState({ timeZoneDetailModal: false });
  }

  selectedItem = (name) => {
    this.setState({ selectedItem: name });
  }

  getMenuItems() {
    const {
      loginInfo,
    } = this.props;

    const isLoggedIn = loginInfo.loginStatus === LoginStates.LoggedIn;

    if (isLoggedIn) {
      if (loginInfo.role !== 'normal_user') {
        return [
          {
            name: "Dashboard",
            key: 'dashboard',
            path: '/dashboard',
          },
          {
            name: "Users",
            key: 'users',
            path: '/users',
          },
        ];
      }
      return [
        {
          name: "Dashboard",
          key: 'dashboard',
          path: '/dashboard',
        }
      ];
    }
    return [];
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
    console.log(user);
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

    return (
      <div className={styles.main}>
        <div title="Go to homepage" onClick={() => this.props.history.push('/')} className={styles['app-title']}>TimeZone App</div>
        <Menu
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
        <div className={styles['profile-actions']}>
          { isLoggedIn && <Button className={styles["add-btn"]} title="Add" onClick={this.handleAdd}><i className='fa fa-plus' /></Button> }
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

const mapDispatchToProps = dispatch => ({ 
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
