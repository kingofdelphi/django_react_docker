import React from 'react';
import { connect } from 'react-redux';

import Button from '../../components/button';
import Input from '../../components/input';
import MessageBox from '../../components/modal/messagebox';
import UserDetail from '../components/userdetail';

import { get_users } from './api';
import withAPIHelper from '../../middleware/api/util';

import styles from './styles.module.scss';

class Users extends React.PureComponent {
  state = {
    users: [],
    selectedUser: this.props.loginInfo,
    newUserName: this.props.loginInfo.username,
    showSuccess: false,
  }

  componentDidMount() {
    this.props.makeApiCall(
      get_users(
        (users) => {
          this.setState({ users });
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
    const users = this.state.users.map(user => user.id === userinfo.id ? userinfo : user);
    this.setState({
      showSuccess: true,
      users: users,
    });
  };

  render() {
    const { 
      users,
      selectedUser,
      newUserName,
      showSuccess,
    } = this.state;

    return (
      <div className={styles.main}>
        <ul className={styles.userlist}>
        { 
          users.map((user) => {
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
            Enter proper credentials and update
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
});

export default connect(mapStateToProps, null)(withAPIHelper(Users));

