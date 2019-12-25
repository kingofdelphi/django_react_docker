import React from 'react';
import { connect } from 'react-redux'

import TimeZone from '../time_zone';

import {
  delete_timezone,
} from '../../api/timezones';

import {
  showEditTimeZoneDetailModal,
} from '../../actions';

import {
  deleteTimeZoneDetail,
} from '../../../../store/timezones/actionCreators';


import getCurrentTimeForTimeZone from './util';

import styles from './styles.module.scss';

class TimeZoneList extends React.Component {
  state = {
    counter: 0,
  };

  componentDidMount() {
    this.timerId = setInterval(
      () => {
        this.setState({ counter: this.state.counter + 1 });
      }, 
      1000
    );
  }

  componentWillMount() {
    clearInterval(this.timerId);
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
    const { 
      timezones,
    } = this.props;

    return (
      <>
        {
          timezones.map(timezone => {
            const { 
              timeInTimeZone,
              timeRelativeToBrowser,
            } = getCurrentTimeForTimeZone(timezone.difference_to_GMT);

            return (
              <TimeZone
                key={timezone.id}
                id={timezone.id}
                name={timezone.name}
                city={timezone.city}
                timeInTimeZone={timeInTimeZone}
                timeRelativeToBrowser={timeRelativeToBrowser}
                onEdit={() => this.props.showEditTimeZoneDetailModal(timezone)}
                onDelete={() => this.handleTimeZoneDelete(timezone)}
                difference_to_GMT={timezone.difference_to_GMT}
              />
            );
          })
        }
      </>
    );
  }
}

const mapStateToProps = state => ({ 
  timezones: state.timezones,
});

const mapDispatchToProps = dispatch => ({ 
  deleteTimeZoneDetail: (timezone) => dispatch(deleteTimeZoneDetail(timezone)),
  showEditTimeZoneDetailModal: (timezone_detail) => dispatch(showEditTimeZoneDetailModal(timezone_detail)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeZoneList);
