import React from 'react';
import { connect } from "react-redux";

import Modal from '../../../../components/modal';
import Input from '../../../../components/input';
import Button from '../../../../components/button';

import { closeModal } from '../../../../store/modals/actionCreators';

import { 
  addTimeZoneDetail,
  updateTimeZoneDetail,
} from '../../../../store/timezones/actionCreators';

import { add_timezone, edit_timezone } from '../../api/timezones';

import styles from './styles.module.scss';

class TimeZoneDetailView extends React.Component {
  state = {
    name: '',
    city: '',
    difference_to_GMT: '',
  }

  constructor(props) {
    super(props);
    this.state['edit_mode'] = props.detail ? true : false;
    if (this.props.detail) {
      Object.assign(this.state, this.props.detail);
    }
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
    const data = {
      name: this.state.name,
      city: this.state.city,
      difference_to_GMT: this.state.difference_to_GMT,
    };
    if (this.state.edit_mode) {
      edit_timezone(
        this.props.detail.id,
        data,
        (time_zone_detail) => {
          this.props.updateTimeZoneDetail(time_zone_detail);
          this.props.close();
        },
        (msg) => {
          console.log(msg);
        }
      );
    } else {
      add_timezone(
        data,
        (time_zone_detail) => {
          this.props.addTimeZoneDetail(time_zone_detail);
          this.props.close();
        },
        (msg) => {
          console.log(msg);
        }
      );
    }
  };

  render() {
    const { edit_mode } = this.state;
    const header_title = edit_mode ? 'Edit Time Zone' : 'Add New Time Zone';
    const action_title = edit_mode ? 'UPDATE' : 'ADD';
    return (
      <Modal>
        <div className={styles.main}>
          <header>
            <h2 className={styles.title}>{header_title}</h2>
          </header>
          <section>
            <form onSubmit={this.handleSubmit}>
              <Input 
                active
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
                <Button type="submit">{action_title}</Button>
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
  updateTimeZoneDetail: (time_zone_detail) => dispatch(updateTimeZoneDetail(time_zone_detail)),
  close: () => dispatch(closeModal()),
});

export default connect(null, mapDispatchToProps)(TimeZoneDetailView);


