import React from 'react';
import { connect } from "react-redux";

import Modal from '../../../../components/modal';
import Input from '../../../../components/input';
import Button from '../../../../components/button';

import { closeModal } from '../../../../modals/actionCreators';
import { addTimeZoneDetail } from '../../meta/actionCreators';

import { add_timezone } from './api';

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

  handleTimeDiffChange = (e) => {
    this.setState({ difference_to_GMT: e.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    add_timezone(
      this.state,
      (time_zone_detail) => {
        this.props.addTimeZoneDetail(time_zone_detail);
        this.props.close();
      },
      (msg) => {
        console.log(msg);
      }
    );
  };

  render() {
    return (
      <Modal>
        <div className={styles.main}>
          <header>
            <h2 className={styles.title}>Add New TimeZone</h2>
          </header>
          <section>
            <form onSubmit={this.handleSubmit}>
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
              <Input 
                id="time_delta" 
                onChange={this.handleTimeDiffChange}
                value={this.state.difference_to_GMT} 
                label="Difference to GMT" 
              />
              <div className={styles.buttons}>
                <Button type="submit">ADD</Button>
                <Button onClick={this.props.close}>CANCEL</Button>
              </div>
            </form>
          </section>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addTimeZoneDetail: (time_zone_detail) => dispatch(addTimeZoneDetail(time_zone_detail)),
  close: () => dispatch(closeModal()),
});

export default connect(null, mapDispatchToProps)(AddNewTimeZone);


