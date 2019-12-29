import React from 'react';

import Modal from '..';
import Button from '../../button';

import styles from './styles.module.scss';

class MessageBox extends React.PureComponent {
  render() {
    const {
      message,
      onSubmit,
    } = this.props;
    return (
      <Modal>
        <div className={styles.main}>
          <label>{message}</label>
          <div>
            <Button onClick={onSubmit}>OK</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default MessageBox;

