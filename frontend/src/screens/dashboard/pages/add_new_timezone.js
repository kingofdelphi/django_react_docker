import React from 'react';

import Input from '../../../components/input';
import Button from '../../../components/button';

import styles from './styles.module.scss';

class AddNewTimeZone extends React.Component {
  state = {
    name: '',
    city: '',
    difference_to_GMT: '',
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  handleCityChange = (e) => {
    this.setState({ city: e.target.value });
  };

  render() {
    const {
      onSubmit,
      onCancel,
    } = this.props;
    return (
      <div className={styles.main}>
        <header>
          <h2 className={styles.title}>Add New TimeZone</h2>
        </header>
        <section>
          <Input 
            id="name" 
            onChange={this.handleNameChange}
            value={this.state.name} 
            label="Name" 
          />
          <Input 
            id="city" 
            onChange={this.handleCityChange}
            value={this.state.city} 
            label="City" 
          />
          <div className={styles.buttons}>
            <Button type="submit" onClick={onSubmit}>ADD</Button>
            <Button onClick={onCancel}>CANCEL</Button>
          </div>
        </section>
      </div>
    );
  }
}

export default AddNewTimeZone;


