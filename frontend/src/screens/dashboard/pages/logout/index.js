import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Modal from '../../../../components/modal';
import Button from '../../../../components/button';

import { closeModal } from '../../../../modals/actionCreators';

import styles from './styles.module.scss';

class Logout extends React.Component {
  onSubmit = () => {
    this.props.history.push('/logout');
    this.props.close();
  }

  onCancel = () => {
    this.props.close();
  }

  render() {
    return (
      <Modal>
        <div className={styles.main}>
          <label>Are you sure you want to log out ?</label>
          <div>
            <Button onClick={this.onSubmit}>Yes</Button>
            <Button onClick={this.onCancel}>No</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeModal()),
});

export default withRouter(connect(null, mapDispatchToProps)(Logout));

