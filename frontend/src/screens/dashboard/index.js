import React from 'react';
import { withRouter } from "react-router-dom";

import Button from '../../components/button';
import { mountModal } from '../../components/modal';

import TimeZone from './components/time_zone';
import AddNewTimeZone from './pages/add_new_timezone';
import LogOut from './pages/logout';

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

  handleLogout = () => {
    let modal;
    const content = (
      <LogOut 
        onSubmit={() => {
          this.props.history.push('/logout');
          modal.close();
        }}
        onCancel={() => modal.close()}
      />
    );
    modal = mountModal(content);
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

  handleTimeZoneSubmit = () => {
    this.modal.close();
  };

  handleTimeZoneClose = () => {
    this.modal.close();
  };

  handleTimeZoneAdd = () => {
    const content = (
      <AddNewTimeZone 
        onSubmit={this.handleTimeZoneSubmit}
        onCancel={this.handleTimeZoneClose}
      />
    );
    this.modal = mountModal(content);
  }

  render() {
    const { timezones } = this.state;
    const description = timezones.length > 0 ?
      "Timezones you've added" : "You have not added any timezones.";
    return (
      <div className={styles['main']}>
        <header>
          <h1 className={styles['dashboard-title']}>Dashboard - TimeZone app</h1>
          <div className={styles['profile-actions']}>
            <Button onClick={this.handleTimeZoneAdd}>Add</Button>
            <Button onClick={this.handleLogout}>LogOut</Button>
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

export default withRouter(Dashboard);

