import React from 'react';
import { withRouter } from 'react-router-dom';

import LogOut from '../../../dashboard/pages/logout';

import styles from './styles.module.scss';

class UserMenu extends React.PureComponent {
  state = {
    dropdown: false,
    logoutModal: false,
  }

  toggleDropDown = () => {
    this.setState({ dropdown: !this.state.dropdown });
  }

  hideDropDown = () => {
    this.setState({ dropdown: false });
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
      username,
      history,
    } = this.props;

    const {
      dropdown,
      logoutModal,
    } = this.state;

    const mainStyles = [styles.main, styles[dropdown ? 'active' : 'inactive']].join(' ');
    return (
      <>
        <button onBlur={this.hideDropDown} className={mainStyles} onClick={this.toggleDropDown}>
          <span className={styles.profile}>{username}</span>
          <div className={styles.dropdown}>
            <ul>
              <li onClick={() => history.push('/profile')}>Settings</li>
              <li onClick={this.showLogOutModal}>Logout</li>
            </ul>
          </div>
        </button>
        { logoutModal && <LogOut onCancel={this.closeLogOutModal} /> }
      </>
    );
  }
}

export default withRouter(UserMenu);

