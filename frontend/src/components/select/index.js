import React from 'react';
import styles from './styles.module.scss';

class Select extends React.PureComponent {
  render() {
    const { 
      items,
      value,
      keySelector,
      valueSelector,
      onChange,
    } = this.props;
    return (
      <select defaultValue={value} className={styles.main} onChange={onChange}>
        { items.map(item => 
          (
            <option 
              key={keySelector(item)}
            >
                {valueSelector(item)}
            </option>
          )
        ) 
        }
      </select>
    );
  }
}

export default Select;

