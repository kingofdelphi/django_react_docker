import React from 'react';
import { connect } from 'react-redux';

import Button from '../../components/button';
import Input from '../../components/input';
import MessageBox from '../../components/modal/messagebox';

import withAPIHelper from '../../middleware/api/util';

import { changePassword } from './api';

import styles from './styles.module.scss';

class Profile extends React.Component {
  state = {
    showSuccess: false,
    current_password: '',
    password1: '',
    password2: '',
    fieldErrors: {},
  };

  onCurrentPasswordChange = (event) => {
    this.setState({ 
      current_password: event.target.value,
    });
  };

  onPassword1Change = (event) => {
    this.setState({ 
      password1: event.target.value,
    });
  };

  onPassword2Change = (event) => {
    this.setState({ 
      password2: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      current_password: this.state.current_password,
      password1: this.state.password1,
      password2: this.state.password2,
    };
    this.props.makeApiCall(
      changePassword(
        this.props.loginInfo.username,
        data,
        (msg) => {
          this.setState({ showSuccess: true, fieldErrors: {} });
        },
        (message, errorObj) => {
          this.setState({ 
            fieldErrors: errorObj
          });
        },
      ));

  };

  render() {
    const {
      current_password,
      password1,
      password2,
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
                id="current_password" 
                type="password"
                value={current_password} 
                label="Current Password" 
                invalid={fieldErrors['current_password']}
                validationMessage={fieldErrors['current_password']}
                onChange={this.onCurrentPasswordChange}
              />
              <Input 
                id="password1" 
                type="password"
                value={password1} 
                label="Password" 
                invalid={fieldErrors['passwords'] || fieldErrors['password1']}
                validationMessage={fieldErrors['password1']}
                onChange={this.onPassword1Change}
              />
              <Input 
                id="password2" 
                autoComplete="current-password"
                type="password"
                value={password2} 
                label="Confirm Password" 
                invalid={fieldErrors['passwords'] || fieldErrors['password2']}
                validationMessage={fieldErrors['password2']}
                onChange={this.onPassword2Change}
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
