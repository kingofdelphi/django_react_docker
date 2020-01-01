import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ConfirmationModal from '../../../../components/modal/confirmation';

import { logoutUser } from '../../../../store/login_info/actionCreators';

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
      { 
        logoutModal && (
        <ConfirmationModal 
          message="Are you sure you want to log out ?"
          onSubmit={this.props.logoutUser} 
          onCancel={this.closeLogOutModal} 
          /> 
        )
      }
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
});

export default withRouter(connect(null, mapDispatchToProps)(UserMenu));

