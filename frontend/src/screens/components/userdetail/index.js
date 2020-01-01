import React from 'react';

import Button from '../../../components/button';
import Input from '../../../components/input';

import { register, updateUser } from './api';

import withAPIHelper from '../../../middleware/api/util';
import styles from './styles.module.scss';

class UserDetail extends React.PureComponent {
  state = {
    formValues: {},
    validationError: '',
    fieldErrors: {},
    registered: { },
    oldUserInfo: null,
  };

  fields = [
    { 
      name: 'username', 
      active: true,
      label: 'Username',
      invalidApiMarkers: ['username'],
      invalidMessageApiField: 'username',
    },
    { 
      name: 'first_name', 
      label: 'First Name',
      invalidApiMarkers: ['first_name'],
      invalidMessageApiField: 'first_name',
    },
    {
      name: 'last_name', 
      label: 'Last Name',
      invalidApiMarkers: ['last_name'],
      invalidMessageApiField: 'last_name',
    },
    {
      name: 'password', 
      label: 'Enter password',
      type: 'password',
      invalidApiMarkers: ['password', 'passwords'],
      invalidMessageApiField: 'password',
    },
    {
      name: 'password1', 
      label: 'Confirm password',
      type: 'password',
      invalidApiMarkers: ['password1', 'passwords'],
      invalidMessageApiField: 'password1',
    },

  ];

  constructor(props) {
    super(props);
    const formValues = {
      'role': 'normal_user',
    };
    this.fields.map(field => formValues[field.name] = '');
    this.state.formValues = formValues;
    this.state = this.handlePropsChange(props);
  }

  handlePropsChange(props) {
    if (this.state.oldUserInfo === props.userInfo) return this.state;
    const { userInfo } = props;
    if (!userInfo) return this.state;
    const new_values = {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      username: userInfo.username,
      role: userInfo.role,
      password: '',
      password1: '',
    };
    const new_state = { ...this.state, formValues: { ...this.state.formValues, ...new_values }, oldUserInfo: userInfo };
    return new_state;
  }

  componentWillReceiveProps(props) {
    this.setState(this.handlePropsChange(props));
  }

  handleRoleChange = (event) => {
    this.setState({ ...this.state, formValues: { ...this.state.formValues, "role": event.target.value }});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { formValues } = this.state;
    const { mode } = this.props;
    if (mode === 'update') {
      this.props.makeApiCall(
        updateUser(
          this.props.user_id,
          formValues,
          (user_info) => {
            this.setState({ fieldErrors: {}, validationError: '' });
            this.props.onSubmit(user_info);
          },
          (message, errorObj) => {
            this.setState({ 
              validationError: message,
              fieldErrors: errorObj
            });
          },
        )
      );
    } else {
      this.props.makeApiCall(
        register(
          formValues,
          (user_info) => {
            this.props.onSubmit(user_info);
          },
          (message, errorObj) => {
            this.setState({ 
              validationError: message,
              fieldErrors: errorObj
            });
          },
          this.props.showRoles,
        )
      );
    }
  }

  handleFormFieldChange = (field, event) => {
    this.setState({ 
      ...this.state,
      formValues: {
        ...this.state.formValues,
        [field.name]: event.target.value,
      }
    });
  }

  render() {
    const {
      formValues,
      validationError,
      fieldErrors,
    } = this.state;

    const {
      className,
      submitName = 'Register',
      showRoles,
    } = this.props;

    const cls = [styles.form, className].join(' ');

    const { role } = formValues;

    return (
      <form className={cls} onSubmit={this.handleSubmit}>
        {
          this.fields.map(field => {
            return (
              <Input 
                key={field.name}
                active={field.active}
                type={field.type || 'text'}
                id={field.name}
                onChange={(e) => this.handleFormFieldChange(field, e)}
                value={formValues[field.name]} 
                label={field.label}
                invalid={field.invalidApiMarkers.filter(apiField => fieldErrors[apiField]).length > 0}
                validationMessage={fieldErrors[field.invalidMessageApiField]}
              />
            );
          })
        }
        {
          (fieldErrors['passwords'] || []).map((message, i) => (
            <span key={i} className={styles.password_validation}>{message}</span>
          ))
        }
        {
          showRoles && (
            <div className={styles.roles}>
              <h4>Role</h4><br/>
              <Input 
                checked={role === "normal_user"}
                value="normal_user" 
                name="role" 
                onChange={this.handleRoleChange} 
                label="Normal User" 
                type="radio" 
              />
              <Input 
                checked={role === "user_manager"}
                value="user_manager" 
                name="role" 
                onChange={this.handleRoleChange} 
                label="User Manager" 
                type="radio" 
              />
            </div>
          )
        }
        <div className={styles.buttons}>
          <Button>{submitName}</Button>
          {this.props.onCancel && <Button onClick={this.props.onCancel}>Cancel</Button>}
        </div>
        <span className={styles['error-message']}>{validationError}&nbsp;</span> 
      </form>
    );
  }
}

export default withAPIHelper(UserDetail);
