import React from 'react';
import { connect } from 'react-redux'

import TimeZoneList from './components/time_zone_list';

import {
  closeModal
} from '../../store/modals/actionCreators';

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

  render() {
    const { timezones } = this.props;
    const description = timezones.length > 0 ?
      "These are the timezones you've added." : "You have not added any timezones.";
    return (
      <div className={styles['main']}>
        <header>
          {description}
        </header>
        <section>
          <TimeZoneList />
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({ 
  setTimeZoneList: (timezones) => dispatch(setTimeZoneList(timezones)),

  closeModal: () => dispatch(closeModal()),
});

const mapStateToProps = state => ({ 
  timezones: state.timezones,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
