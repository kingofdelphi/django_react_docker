import React from 'react';
import { connect } from 'react-redux';

import Modal from '../../../../components/modal';
import UserDetail from '../../../components/userdetail';

import withAPIHelper from '../../../../middleware/api/util';

import styles from './styles.module.scss';

class AddUser extends React.PureComponent {
  handleSubmit = (userinfo) => {
    this.props.onSubmit(userinfo);
  };

  render() {
    const {
      loginInfo
    } = this.props;
    return (
      <Modal contentClass={styles.main}>
        <header className={styles.header}>
          Add New User
        </header>
        <UserDetail 
          showRoles={loginInfo.role === 'admin'}
          className={styles.form}
          submitName="Save"
          onSubmit={this.handleSubmit} 
          onCancel={this.props.onCancel}
        />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({ 
  loginInfo: state.loginInfo,
});

export default connect(mapStateToProps, null)(withAPIHelper(AddUser));

