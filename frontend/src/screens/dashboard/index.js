  import React from 'react';
import { connect } from 'react-redux'

import TimeZoneList from './components/time_zone_list';
import Search from '../components/search';
import Button from '../../components/button';
import Select from '../../components/select';

import * as LoginStates from '../../store/login_info/login_states';
import {
  setTimeZoneList,
} from '../../store/timezones/actionCreators';

import { setTimeZoneListFilter, setActionUser } from '../../store/timezones/actionCreators';

import {
  get_timezones,
} from './api/timezones';

import {
  get_user_list,
} from './api';

import withAPIHelper from '../../middleware/api/util';
import styles from './styles.module.scss';

class Dashboard extends React.PureComponent {
  state = {
    list: false,
    sorted: false,
    user_list: [],
  };

  componentDidMount() {
    const { username } = this.props.loginInfo;
    this.props.makeApiCall(
      get_timezones(
        (timezones) => {
          this.props.setTimeZoneList(username, timezones);
        },
        (error_message) => {
        },
      )
    )
    this.props.makeApiCall(
      get_user_list(
        (user_list) => {
          this.setState({ user_list });
        },
        (error_message) => {
        },
      )
    );
  }

  getActionUser = () => {
    const {
      loginInfo,
      actionUser,
    } = this.props;
    return actionUser || loginInfo.username;
  };

  getFilteredTimezones = () => {
    const { 
      timezones,
      timeZoneFilter,
    } = this.props;

    const {
      sorted: sortByName,
    } = this.state;

    const selectedUser = this.getActionUser();

    const result = (timezones[selectedUser] || []).filter(timezone => {
      return timezone.name.indexOf(timeZoneFilter) !== -1;
    });
    // sort my first match
    const sorted = result.sort((a, b) => {
      return a.name.indexOf(timeZoneFilter) - b.name.indexOf(timeZoneFilter);
    });
    if (sortByName) {
      return sorted.sort((a, b) => {
        return a.name.localeCompare(b.name);
      }); 
    }
    return sorted;
  }

  getDescription(timezones) {
    const { 
      timeZoneFilter,
      loginInfo,
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
    const reference = loginInfo.username === this.getActionUser() ? "you have" : `${this.getActionUser()} has`;
    return timezones.length > 0 ? `These are the timezones ${reference} added.` : `${reference} not added any timezones.`;
  }

  handleFilterChange = (event) => {
    this.props.setTimeZoneListFilter(event.target.value);
  }

  handleSelectChange = (event) => {
    const selectedUser = event.target.value;
    this.props.setActionUser(selectedUser);
    this.props.makeApiCall(
      get_timezones(
        (timezones) => {
          this.props.setTimeZoneList(selectedUser, timezones);
        },
        (error_message) => {
        },
        selectedUser,
      )
    );
  }

  render() {
    const timezones = this.getFilteredTimezones();
    const description = this.getDescription(timezones);
    const {
      timeZoneFilter,
      loginInfo,
    } = this.props;

    const isLoggedIn = loginInfo.loginStatus === LoginStates.LoggedIn;

    const showUserList = isLoggedIn && loginInfo.role === 'admin';

    const { 
      sorted,
      list,
      user_list,
    } = this.state;

    const filterUser = this.getActionUser();
    
    const listStyles = [styles.timezone_list, list ? styles['active'] : ''].join(' ');
    const buttonStyles = [styles['list-button'], list ? styles['active'] : ''].join(' ');
    const sortedStyles = [styles['sort-button'], sorted ? styles['active'] : ''].join(' ');

    return (
      <div className={styles['main']}>
        <header>
          <div className={styles.description}>{description}</div>
          <div className={styles['timezone-actions']}>
            { showUserList && (
              <Select 
                keySelector={item => item.username} 
                value={filterUser}
                onChange={this.handleSelectChange}
                valueSelector={item => item.username} 
                items={user_list}
              />
            )
            }
            { isLoggedIn && ( 
              <>
                <Button 
                  className={sortedStyles}
                  onClick={() => this.setState({ sorted: !sorted })}
                >
                  <i className="fa fa-sort" />
                </Button>
                <Button 
                  className={buttonStyles}
                  onClick={() => this.setState({ list: !list })}
                >
                  <i className="fa fa-list" />
                </Button>
                <Search 
                  maxLength="30"
                  value={timeZoneFilter} 
                  placeholder="Filter by name"
                  onChange={this.handleFilterChange} 
                />
              </>
            )
            }
        </div>
        </header>
        <section>
          <TimeZoneList className={listStyles} timezones={timezones} />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({ 
  timezones: state.timezones,
  timeZoneFilter: state.timeZoneFilter,
  actionUser: state.actionUser,
  loginInfo: state.loginInfo,
});

const mapDispatchToProps = {
  setTimeZoneList,
  setTimeZoneListFilter,
  setActionUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(withAPIHelper(Dashboard));
