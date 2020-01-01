import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Button from '../../components/button';
import MessageBox from '../../components/modal/messagebox';
import ConfirmationModal from '../../components/modal/confirmation';
import UserDetail from '../components/userdetail';

import { logoutUser } from '../../store/login_info/actionCreators';
import { setUserList, updateUser, deleteUser } from '../../store/userlist/actionCreators';

import { get_users, delete_user } from './api';
import withAPIHelper from '../../middleware/api/util';

import styles from './styles.module.scss';

class Users extends React.PureComponent {
  state = {
    selectedUser: this.props.loginInfo,
    showSuccess: false,
    showDelete: false,
  }

  componentDidMount() {
    this.props.makeApiCall(
      get_users(
        (users) => {
          this.props.setUserList(users);
        },
        () => {
        },
      )
    );
  }

  handleUserSelect = (user) => {
    user = { ...user, password: '', password1: '' };
    this.setState({ 
      selectedUser: user,
    });
  }

  handleSubmit = (userinfo) => {
    this.props.updateUser(userinfo);
    const { loginInfo } = this.props;
    if (loginInfo.id === userinfo.id) {
      localStorage.setItem('token', userinfo.token);
      delete userinfo.token;
    }
    this.setState({
      showSuccess: true,
    });
  };

  handleUserDelete = () => {
    const { selectedUser } = this.state;
    const {
      loginInfo,
      userList,
    } = this.props;
    this.props.makeApiCall(
      delete_user(
        selectedUser.id,
        () => {
          if (loginInfo.id === selectedUser.id) {
            this.props.logoutUser();
          } else {
            this.props.deleteUser(selectedUser);
            this.setState({ 
              selectedUser: userList.find(user => user.id !== selectedUser.id),
              showDelete: false,
            });
          }
        },
        () => {
        },
      )
    )
  };

  render() {
    const { 
      selectedUser,
      showSuccess,
      showDelete,
    } = this.state;

    const {
      loginInfo,
      userList
    } = this.props;


    return (
      <div className={styles.main}>
        <ul className={styles.userlist}>
        { 
          userList.map((user) => {
            return (
              <li 
                className={selectedUser.id === user.id ? styles['active'] : ''}
                key={user.username}
                onClick={() => this.handleUserSelect(user)}
              >
                {user.username}
              </li>
            );
          })
        }
        </ul>
        <div className={styles.form}>
          <header className={styles.header}>
            Enter proper credentials and update or 
            <Button onClick={() => this.setState({ showDelete: true })}>Delete User</Button>
          </header>
          <UserDetail 
            showRoles={loginInfo.role === "admin" && selectedUser.id !== loginInfo.id}
            mode='update'
            user_id={selectedUser.id}
            className={styles.form}
            userInfo={selectedUser}
            submitName="Save"
            onSubmit={this.handleSubmit} 
          />
        </div>
        { showSuccess && 
            <MessageBox onSubmit={() => this.setState({ showSuccess: false })} 
              message="Profile has been updated" 
            /> 
        }
        { showDelete && 
            <ConfirmationModal onSubmit={this.handleUserDelete} 
              onCancel={() => this.setState({ showDelete: false })}
              message={`Are you sure you want to delete ${selectedUser.username} ?`}
            /> 
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({ 
  loginInfo: state.loginInfo,
  userList: state.userList,
});

const mapDispatchToProps = dispatch => ({ 
  logoutUser: () => dispatch(logoutUser()),
  setUserList: (list) => dispatch(setUserList(list)),
  updateUser: (user_info) => dispatch(updateUser(user_info)),
  deleteUser: (user_info) => dispatch(deleteUser(user_info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withAPIHelper(withRouter(Users)));

