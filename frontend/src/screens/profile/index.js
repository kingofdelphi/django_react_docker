import React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/button';
import Input from '../../components/input';
import MessageBox from '../../components/modal/messagebox';

import withAPIHelper from '../../middleware/api/util';

import { changePassword } from './api';

import styles from './styles.module.scss';

function Profile(props) {

  const [showSuccess, setShowSuccess] = useState(false);
  const [current_password, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      current_password,
      password,
      password1,
    };
    props.makeApiCall(
      changePassword(props.loginInfo.id, data),
      (msg) => {
        setShowSuccess(true);
        setFieldErrors({});
      },
      (message, errorObj) => {
        setFieldErrors(errorObj);
      },
    );
  };
  return (
    <div className={styles.main}>
        { showSuccess && (
          <MessageBox message="Your password has been changed successully." onSubmit={() => setShowSuccess(false)} /> 
        )
        }
      <div>
        <h3>Change Password</h3>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input 
              active
              autoComplete="current-password"
              type="password"
              value={current_password} 
              label="Current Password" 
              invalid={fieldErrors['current_password']}
              validationMessage={fieldErrors['current_password']}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input 
              autoComplete="password"
              type="password"
              value={password} 
              label="Confirm Password" 
              invalid={fieldErrors['passwords'] || fieldErrors['password']}
              validationMessage={fieldErrors['password']}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input 
              autoComplete="confirm-password"
              type="password"
              value={password1} 
              label="Password" 
              invalid={fieldErrors['passwords'] || fieldErrors['password1']}
              validationMessage={fieldErrors['password1']}
              onChange={(e) => setPassword1(e.target.value)}
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

const mapStateToProps = state => ({ 
  loginInfo: state.loginInfo,
});

export default connect(mapStateToProps, null)(withAPIHelper(Profile));
