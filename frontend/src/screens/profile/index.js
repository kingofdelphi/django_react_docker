import React from 'react';
import { connect } from 'react-redux';

import Button from '../../components/button';
import Input from '../../components/input';
import MessageBox from '../../components/modal/messagebox';

import withAPIHelper from '../../middleware/api/util';

import { changePassword } from './api';

import styles from './styles.module.scss';

class Profile extends React.PureComponent {
  state = {
    showSuccess: false,
    current_password: '',
    password: '',
    password1: '',
    fieldErrors: {},
  };

  onCurrentPasswordChange = (event) => {
    this.setState({ 
      current_password: event.target.value,
    });
  };

  onPasswordChange = (event) => {
    this.setState({ 
      password: event.target.value,
    });
  };

  onPassword1Change = (event) => {
    this.setState({ 
      password1: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      current_password: this.state.current_password,
      password: this.state.password,
      password1: this.state.password1,
    };
    this.props.makeApiCall(
      changePassword(this.props.loginInfo.id, data),
      (msg) => {
        this.setState({ showSuccess: true, fieldErrors: {} });
      },
      (message, errorObj) => {
        this.setState({ 
          fieldErrors: errorObj
        });
      },
    );
  };

  render() {
    const {
      current_password,
      password,
      password1,
      fieldErrors,
      showSuccess,
    } = this.state;
    return (
      <div className={styles.main}>
          { showSuccess && (
            <MessageBox message="Your password has been changed successully." onSubmit={() => this.setState({ showSuccess: false })} /> 
          )
          }
        <div>
          <h3>Change Password</h3>
            <form className={styles.form} onSubmit={this.handleSubmit}>
              <Input 
                active
                autoComplete="current-password"
                type="password"
                value={current_password} 
                label="Current Password" 
                invalid={fieldErrors['current_password']}
                validationMessage={fieldErrors['current_password']}
                onChange={this.onCurrentPasswordChange}
              />
              <Input 
                autoComplete="current-password"
                type="password"
                value={password} 
                label="Confirm Password" 
                invalid={fieldErrors['passwords'] || fieldErrors['password']}
                validationMessage={fieldErrors['password']}
                onChange={this.onPasswordChange}
              />
              <Input 
                type="password"
                value={password1} 
                label="Password" 
                invalid={fieldErrors['passwords'] || fieldErrors['password1']}
                validationMessage={fieldErrors['password1']}
                onChange={this.onPassword1Change}
              />
              {
                (fieldErrors['passwords'] || []).map((message, i) => (
                  <span key={i} className={styles.password_validation}>{message}</span>
                ))
              }
            <Button>Submit</Button>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ 
  loginInfo: state.loginInfo,
});

export default connect(mapStateToProps, null)(withAPIHelper(Profile));
