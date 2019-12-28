import React from 'react';
import { connect } from "react-redux";

import Modal from '../../../../components/modal';
import Input from '../../../../components/input';
import Button from '../../../../components/button';
import Loading from '../../../../components/loading';

import { 
  addTimeZoneDetail,
  updateTimeZoneDetail,
} from '../../../../store/timezones/actionCreators';

import { add_timezone, edit_timezone } from '../../api/timezones';

import styles from './styles.module.scss';

class TimeZoneDetailView extends React.Component {
  state = {
    name: '',
    city: '',
    difference_to_GMT: '',
    fieldErrors: {},
    loading: false,
  }

  constructor(props) {
    super(props);
    this.state['edit_mode'] = props.detail ? true : false;
    if (this.props.detail) {
      Object.assign(this.state, this.props.detail);
    }
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  handleCityChange = (e) => {
    this.setState({ city: e.target.value });
  };

  handleTimeDiffChange = (e) => {
    this.setState({ difference_to_GMT: e.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: this.state.name,
      city: this.state.city,
      difference_to_GMT: this.state.difference_to_GMT,
    };
    this.setState({ loading: true });
    if (this.state.edit_mode) {
      edit_timezone(
        this.props.detail.id,
        data,
        (time_zone_detail) => {
          this.props.updateTimeZoneDetail(time_zone_detail);
          this.props.onCancel();
        },
        (errors) => {
          this.setState({ fieldErrors: errors, loading: false });
        }
      );
    } else {
      add_timezone(
        data,
        (time_zone_detail) => {
          this.props.addTimeZoneDetail(time_zone_detail);
          this.props.onCancel();
        },
        (errors) => {
          this.setState({ fieldErrors: errors });
          this.setState({ loading: false });
        }
      );
    }
  };

  render() {
    const { 
      edit_mode,
      fieldErrors,
      loading,
    } = this.state;

    const header_title = edit_mode ? 'Edit Time Zone' : 'Add New Time Zone';
    const action_title = edit_mode ? 'Update' : 'Add';

    return (
      <>
        <Modal>
          <div className={styles.main}>
            <header>
              {header_title}
            </header>
            <section>
              <form onSubmit={this.handleSubmit}>
                <Input 
                  active
                  id="name" 
                  onChange={this.handleNameChange}
                  value={this.state.name} 
                  label="Name" 
                  invalid={fieldErrors['name']}
                  validationMessage={fieldErrors['name']}
                />
                <Input 
                  id="city" 
                  onChange={this.handleCityChange}
                  value={this.state.city} 
                  label="City" 
                  invalid={fieldErrors['city']}
                  validationMessage={fieldErrors['city']}
                />
                <Input 
                  id="time_delta" 
                  onChange={this.handleTimeDiffChange}
                  value={this.state.difference_to_GMT} 
                  label="Difference to GMT" 
                  invalid={fieldErrors['difference_to_GMT']}
                  validationMessage={fieldErrors['difference_to_GMT']}
                />
                <div className={styles.buttons}>
                  <Button type="submit">{action_title}</Button>
                  <Button onClick={this.props.onCancel}>Cancel</Button>
                </div>
              </form>
            </section>
          </div>
        </Modal>
        { loading && <Loading /> }
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addTimeZoneDetail: (time_zone_detail) => dispatch(addTimeZoneDetail(time_zone_detail)),
  updateTimeZoneDetail: (time_zone_detail) => dispatch(updateTimeZoneDetail(time_zone_detail)),
});

export default connect(null, mapDispatchToProps)(TimeZoneDetailView);


