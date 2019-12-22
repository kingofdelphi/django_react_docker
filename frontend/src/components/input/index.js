import React from 'react';
import styles from './styles.module.scss';

class Input extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    if (this.props.active) {
      // hacky
      setTimeout(() => this.ref.focus());
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

