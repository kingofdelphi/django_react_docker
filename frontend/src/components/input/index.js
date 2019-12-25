import React from 'react';
import styles from './styles.module.scss';

class Input extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    if (this.props.active) {
      // since setTimeout is queued, sometimes ref gets destroyed
      // due to url redirection
      setTimeout(() => this.ref && this.ref.focus());
    }
  }

  render() {
    const { 
      id,
      label,
      type,
      value,
      onChange,
    } = this.props;
    return (
      <>
        <label htmlFor={id}>{label}</label>
        <input 
          ref={(el) => this.ref = el}
          autoComplete={id}
          id={id} 
          type={type}
          value={value}
          onChange={onChange} 
          className={styles.input} 
        />
      </>
    );
  }
}

export default Input;

