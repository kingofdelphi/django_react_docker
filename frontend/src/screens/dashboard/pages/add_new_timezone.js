import React from 'react';
import { connect } from "react-redux";

import Modal from '../../../components/modal';
import Input from '../../../components/input';
import Button from '../../../components/button';

import { closeModal } from '../../../modals/actionCreators';

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

  handleSubmit = () => {
    console.log(this.state);
    this.props.close();
  };

  render() {
    return (
      <Modal>
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
              <Button type="submit" onClick={this.handleSubmit}>ADD</Button>
              <Button onClick={this.props.close}>CANCEL</Button>
            </div>
          </section>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeModal()),
});

export default connect(null, mapDispatchToProps)(AddNewTimeZone);


