import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Button from '../../components/button';
import Input from '../../components/input';
import MessageBox from '../../components/modal/messagebox';
import UserDetail from '../components/userdetail';

import { get_users, delete_user } from './api';
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

  handleUserDelete = () => {
    const { selectedUser } = this.state;
    const {
      loginInfo
    } = this.props;
    this.props.makeApiCall(
      delete_user(
        selectedUser.id,
        () => {
          const users = this.state.users.filter(user => user.id !== selectedUser.id);
          if (loginInfo.id === selectedUser.id) {
            this.props.history.push('/logout');
          } else {
            this.setState({ 
              users,
              selectedUser: users[0],
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
});

export default connect(mapStateToProps, null)(withAPIHelper(withRouter(Users)));

