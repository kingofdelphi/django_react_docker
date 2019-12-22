import React from 'react';
import { connect } from 'react-redux'

import Button from '../../components/button';
import { 
  addModal,
  closeModal
} from '../../modals/actionCreators';

import * as ModalTypes from '../../modals/modal_types';

import TimeZone from './components/time_zone';

import { 
  get_timezones,
  delete_timezone
} from './api';

import styles from './styles.module.scss';

class Dashboard extends React.Component {
  state = {
    timezones: []
  };

  componentDidMount() {
    get_timezones(
      (timezones) => {
        this.setState({ timezones });
      },
      (error_message) => {
        alert(error_message);
      },
    );
  }

  handleTimeZoneDelete = (timezone) => {
    delete_timezone(
      timezone.id,
      () => {
        this.setState({
          timezones: this.state.timezones.filter(tz => tz.id !== timezone.id),
        });
      },
      () => {
        alert('cant delete');
      },
    );
  };

  render() {
    const { timezones } = this.state;
    const description = timezones.length > 0 ?
      "Timezones you've added" : "You have not added any timezones.";
    return (
      <div className={styles['main']}>
        <header>
          <h1 className={styles['dashboard-title']}>Dashboard - TimeZone app</h1>
          <div className={styles['profile-actions']}>
            <Button onClick={this.props.addTimeZoneDetailScreen}>Add</Button>
            <Button onClick={this.props.addLogoutScreen}>LogOut</Button>
          </div>
        </header>
        <section>
          <h3>{description}</h3>
          {
            timezones.map(timezone => {
              return (
                <TimeZone
                  key={timezone.id}
                  id={timezone.id}
                  name={timezone.name}
                  city={timezone.city}
                  onDelete={() => this.handleTimeZoneDelete(timezone)}
                  difference_to_GMT={timezone.difference_to_GMT}
                />
              );
            })
          }
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({ 
  addTimeZoneDetailScreen: () => dispatch(addModal(ModalTypes.TimeZoneDetail)),
  addLogoutScreen: () => dispatch(addModal(ModalTypes.LogOut)),
  closeModal: () => dispatch(closeModal()),
});


export default connect(null, mapDispatchToProps)(Dashboard);
