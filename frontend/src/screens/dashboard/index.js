import React from 'react';
import { connect } from 'react-redux'

import Button from '../../components/button';
import TimeZone from './components/time_zone';

import { 
  closeModal
} from '../../store/modals/actionCreators';

import { 
  showLogOutModal,
  showAddNewTimeZoneDetailModal,
  showEditTimeZoneDetailModal,
} from './actions';

import { 
  setTimeZoneList,
  deleteTimeZoneDetail,
} from '../../store/timezones/actionCreators';

import { 
  get_timezones,
  delete_timezone
} from './api';

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

  handleTimeZoneDelete = (timezone) => {
    delete_timezone(
      timezone.id,
      () => {
        this.props.deleteTimeZoneDetail(timezone);
      },
      () => {
        alert('cant delete');
      },
    );
  };

  render() {
    const { timezones } = this.props;
    console.log(timezones);
    const description = timezones.length > 0 ?
      "These are the timezones you've added." : "You have not added any timezones.";
    return (
      <div className={styles['main']}>
        <header>
          <h1 className={styles['dashboard-title']}>Dashboard - TimeZone app</h1>
          <div className={styles['profile-actions']}>
            <Button onClick={this.props.showAddNewTimeZoneDetailModal}>Add</Button>
            <Button onClick={this.props.showLogOutModal}>LogOut</Button>
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
                  onEdit={() => this.props.showEditTimeZoneDetailModal(timezone)}
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
  setTimeZoneList: (timezones) => dispatch(setTimeZoneList(timezones)),
  deleteTimeZoneDetail: (timezone) => dispatch(deleteTimeZoneDetail(timezone)),

  showAddNewTimeZoneDetailModal: () => dispatch(showAddNewTimeZoneDetailModal()),
  showEditTimeZoneDetailModal: (timezone_detail) => dispatch(showEditTimeZoneDetailModal(timezone_detail)),
  showLogOutModal: () => dispatch(showLogOutModal()),
  closeModal: () => dispatch(closeModal()),
});

const mapStateToProps = state => ({ 
  timezones: state.timezones,
});



export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
