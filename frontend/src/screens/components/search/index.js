import React from 'react';

import Input from '../../../components/input';

import styles from './styles.module.scss';

class Search extends React.PureComponent {
  render() {
    const { 
      value,
      onChange,
      placeholder,
    } = this.props;
    return (
      <div className={styles.main}>
        <i className="fa fa-search"></i> 
        <Input 
          placeholder={placeholder}
          value={value}
          onChange={onChange} 
        />
      </div>
    );
  }
}

export default Search;

