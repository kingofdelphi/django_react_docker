import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/button';

import TimeZone from './components/time_zone';
import { get_timezones } from './api';

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

  render() {
    const { timezones } = this.state;
    return (
      <div className={styles['main']}>
        <header>
          <h1 className={styles['dashboard-title']}>Dashboard - TimeZone app</h1>
          <div className={styles['profile-actions']}>
            <Button>Add</Button>
            <Link to='/logout'>LogOut</Link>
          </div>
        </header>
        <section>
          <h3>Timezones you've added</h3>
          {
            timezones.map(timezone => {
              return (
                <TimeZone
                  key={timezone.name}
                  name={timezone.name}
                  city={timezone.city}
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

export default Dashboard;

