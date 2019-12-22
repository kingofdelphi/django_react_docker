import React from 'react';
import ReactDOM from 'react-dom';

import styles from './styles.module.scss';

const appRoot = document.getElementById('root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  modalContainer = () => {
    return ReactDOM.findDOMNode(this).parentNode;
  }

  componentDidMount() {
    appRoot.classList.add(styles.root);
  }

  componentWillUnmount() {
    appRoot.classList.remove(styles.root);
    modalRoot.removeChild(this.modalContainer());
  }
  
  close() {
    ReactDOM.unmountComponentAtNode(this.modalContainer());
  }

  render() {
    const { 
      children,
      contentClass
    } = this.props;

    const contentStyle = [styles.content, contentClass].join(' ');

    return (
      <div className={styles.main}>
        <div className={contentStyle}>
          {children}
        </div>
      </div>
    );
  }
}

export const mountModal = (children) => {
  const modalContainer = document.createElement('div');
  modalRoot.appendChild(modalContainer);
  const modal = (
    <Modal>{children}</Modal>
  );
  return ReactDOM.render(modal, modalContainer);
};

export default Modal;
