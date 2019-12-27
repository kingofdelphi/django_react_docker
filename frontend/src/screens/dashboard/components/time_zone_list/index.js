import React from 'react';
import { connect } from 'react-redux'

import TimeZone from '../time_zone';
import TimeZoneDetail from '../../pages/timezone_detail';

import DeleteModal from '../delete_confirm_modal';

import getCurrentTimeForTimeZone from './util';

class TimeZoneList extends React.Component {
  state = {
    counter: 0,
    deleteModalInfo: null,
    editTimeZoneModalInfo: null,
  };

  componentDidMount() {
    this.timerId = setInterval(
      () => {
        this.setState({ counter: this.state.counter + 1 });
      }, 
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  handleTimeZoneDelete = (timezone) => {
    this.setState({ deleteModalInfo: timezone });
  };

  closeDeleteModal = () => {
    this.setState({ deleteModalInfo: null });
  }

  handleEditTimeZoneDetail = (timezone) => {
    this.setState({ editTimeZoneModalInfo: timezone });
  };

  closeTimeZoneDetailModal = () => {
    this.setState({ editTimeZoneModalInfo: null });
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

  render() {

    const { 
      deleteModalInfo,
      editTimeZoneModalInfo,
    } = this.state;

    const filteredTimezones = this.getFilteredTimezones();

    return (
      <>
        {
          filteredTimezones.map(timezone => {
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
                onEdit={() => this.handleEditTimeZoneDetail(timezone)}
                onDelete={() => this.handleTimeZoneDelete(timezone)}
                difference_to_GMT={timezone.difference_to_GMT}
              />
            );
          })
        }
        {
          deleteModalInfo && ( 
            <DeleteModal 
              timezone={deleteModalInfo} 
              onCancel={this.closeDeleteModal}
            /> 
          )
        }
      {
        editTimeZoneModalInfo && ( 
          <TimeZoneDetail 
            detail={editTimeZoneModalInfo} 
            onCancel={this.closeTimeZoneDetailModal}
          /> 
        )
      }
      </>
    );
  }
}

const mapStateToProps = state => ({ 
  timezones: state.timezones,
  timeZoneFilter: state.timeZoneFilter,
});

export default connect(mapStateToProps, null)(TimeZoneList);
