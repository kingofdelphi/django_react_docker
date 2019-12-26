import React from 'react';
import { connect } from "react-redux";

import Modal from '..';
import Button from '../../button';

import { closeModal } from '../../../store/modals/actionCreators';

import styles from './styles.module.scss';

class ConfirmationModal extends React.Component {
  render() {
    const {
      message,
      onSubmit,
      onCancel,
    } = this.props;
    return (
      <Modal>
        <div className={styles.main}>
          <label>{message}</label>
          <div>
            <Button onClick={onSubmit}>Yes</Button>
            <Button onClick={onCancel}>No</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onCancel: () => dispatch(closeModal()),
});

export default connect(null, mapDispatchToProps)(ConfirmationModal);
