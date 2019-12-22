import React from 'react';
import ReactDOM from 'react-dom';

import styles from './styles.module.scss';

const appRoot = document.getElementById('root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.content = React.createRef();
  }

  componentDidMount() {
    appRoot.classList.add(styles.root);
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    appRoot.classList.remove(styles.root);
    modalRoot.removeChild(this.el);
  }
  
  render() {
    const { 
      children,
      contentClass
    } = this.props;

    const contentStyle = [styles.content, contentClass].join(' ');

    const content = (
      <div className={styles.main}>
        <div ref={(content) => this.content = content } className={contentStyle}>
          {children}
        </div>
      </div>
    );

    return ReactDOM.createPortal(
      content,
      this.el,
    );
  }
}

export default Modal;
