import React from 'react';
import { connect } from 'react-redux'

import TimeZoneList from './components/time_zone_list';

import {
  setTimeZoneList,
} from '../../store/timezones/actionCreators';

import {
  get_timezones,
} from './api/timezones';

import styles from './styles.module.scss';

class Dashboard extends React.Component {
  componentDidMount() {
    get_timezones(
      (timezones) => {
        this.props.setTimeZoneList(timezones);
      },
      (error_message) => {
        alert(error_message);
      },
    );
  }

  getFilteredTimezones = () => {
    const { 
      timezones,
      timeZoneFilter,
    } = this.props;
    const result = timezones.filter(timezone => {
      return timezone.name.indexOf(timeZoneFilter) !== -1;
    });
    const sorted = result.sort((a, b) => {
      return a.name.indexOf(timeZoneFilter) - b.name.indexOf(timeZoneFilter);
    });
    return sorted;
  }

  getDescription(timezones) {
    const { 
      timeZoneFilter,
    } = this.props;
    
    if (timeZoneFilter) {
      return (
        <>
          <span className={styles['results-count']}>{timezones.length}</span>
          <span> timezone{timezones.length > 1 ? "s" : ""} found containing the search field </span>
          <span className={styles.searchfield}>{timeZoneFilter}</span>
        </>
      );
    }

    return timezones.length > 0 ? "These are the timezones you've added." : "You have not added any timezones.";
  }

  render() {
    const timezones = this.getFilteredTimezones();
    const description = this.getDescription(timezones);

    return (
      <div className={styles['main']}>
        <header>
          {description}
        </header>
        <section>
          <TimeZoneList timezones={timezones} />
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({ 
  setTimeZoneList: (timezones) => dispatch(setTimeZoneList(timezones)),
});

const mapStateToProps = state => ({ 
  timezones: state.timezones,
  timeZoneFilter: state.timeZoneFilter,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
