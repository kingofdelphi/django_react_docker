import React from 'react';
import { connect } from 'react-redux'

import TimeZoneList from './components/time_zone_list';
import Loading from '../../components/loading';
import Search from '../components/search';

import * as LoginStates from '../../store/login_info/login_states';
import {
  setTimeZoneList,
} from '../../store/timezones/actionCreators';

import { setTimeZoneListFilter } from '../../store/timezones/actionCreators';

import {
  get_timezones,
} from './api/timezones';

import withAPIHelper from '../../middleware/api/util';
import styles from './styles.module.scss';

class Dashboard extends React.Component {
  state = {
    loading: true,
  }
  componentDidMount() {
    this.props.makeApiCall(
      get_timezones(
        (timezones) => {
          this.props.setTimeZoneList(timezones);
          this.setState({ loading: false });
        },
        (error_message) => {
          this.setState({ loading: false });
        },
      )
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
          <span> timezone{timezones.length !== 1 ? "s" : ""} found containing </span>
          <span className={styles.searchfield}>{timeZoneFilter}</span>
        </>
      );
    }

    return timezones.length > 0 ? "These are the timezones you've added." : "You have not added any timezones.";
  }

  handleFilterChange = (event) => {
    this.props.setTimeZoneListFilter(event.target.value);
  }

  render() {
    const timezones = this.getFilteredTimezones();
    const description = this.getDescription(timezones);
    const {
      timeZoneFilter,
      loginInfo,
    } = this.props;

    const isLoggedIn = loginInfo.loginStatus === LoginStates.LoggedIn;

    return (
      <div className={styles['main']}>
        { this.state.loading && <Loading /> }
        <header>
          <div>{description}</div>
          <div className={styles['timezone-actions']}>
            { isLoggedIn && ( 
              <Search 
                maxLength="20"
                value={timeZoneFilter} 
                placeholder="Filter by name"
                onChange={this.handleFilterChange} 
              />
            )
            }
        </div>
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
  setTimeZoneListFilter: (value) => dispatch(setTimeZoneListFilter(value)),
});

const mapStateToProps = state => ({ 
  timezones: state.timezones,
  timeZoneFilter: state.timeZoneFilter,
  loginInfo: state.loginInfo,
});

export default connect(mapStateToProps, mapDispatchToProps)(withAPIHelper(Dashboard));
