import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Button from '../../components/button';
import MessageBox from '../../components/modal/messagebox';
import UserDetail from '../components/userdetail';

import { get_users, delete_user } from './api';
import withAPIHelper from '../../middleware/api/util';

import { setUserList, updateUser, deleteUser } from '../../store/userlist/actionCreators';

import styles from './styles.module.scss';

class Users extends React.PureComponent {
  state = {
    selectedUser: this.props.loginInfo,
    newUserName: this.props.loginInfo.username,
    showSuccess: false,
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
    this.setState({ 
      selectedUser: user,
      newUserName: user.username,
    });
  }

  handleUserNameChange = (username) => {
    this.setState({ 
      newUserName: username,
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
            this.props.history.push('/logout');
          } else {
            this.props.deleteUser(selectedUser);
            this.setState({ 
              selectedUser: userList.find(user => user.id !== selectedUser.id)
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
      newUserName,
      showSuccess,
    } = this.state;

    const {
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
            <Button onClick={this.handleUserDelete}>Delete User</Button>
          </header>
          <UserDetail 
            mode='update'
            user_id={selectedUser.id}
            className={styles.form}
            username={newUserName}
            submitName="Save"
            onUsernameChange={this.handleUserNameChange}
            onSubmit={this.handleSubmit} 
          />
        </div>
          { showSuccess && 
              <MessageBox onSubmit={() => this.setState({ showSuccess: false })} 
                message="Profile has been updated" 
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
  setUserList: (list) => dispatch(setUserList(list)),
  updateUser: (user_info) => dispatch(updateUser(user_info)),
  deleteUser: (user_info) => dispatch(deleteUser(user_info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withAPIHelper(withRouter(Users)));

