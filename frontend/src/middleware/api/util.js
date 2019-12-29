import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ConfirmationModal from '../../components/modal/confirmation';

import makeApiCall from './actionCreators';

function withAPIHelper(WrappedComponent) {
  const cls = class extends React.PureComponent {
    state = {
      sessionValid: true,
      redirectToHome: false,
    }

    invalidateSession = () => {
      this.setState({ sessionValid: false });
    }

    render() {
      const { sessionValid, redirectToHome } = this.state;
      if (redirectToHome) {
        return (
          <Redirect to='/logout' />
        );
      }
      return (
        <div style={{ height: '100%' }}>
          <WrappedComponent 
            {...this.props}
            makeApiCall={(params) => this.props.dispatch(makeApiCall(params), { invalidateSession: this.invalidateSession })} 
          />
          {
            !sessionValid && (
              <ConfirmationModal 
                message="Session is invalid. Do you want to log out ?." 
                onSubmit={() => {
                  this.setState({ redirectToHome: true });
                }}
                onCancel={() => this.setState({ sessionValid: true })}
              /> 
            )
          }
        </div>
      );
    }
  }
  return connect()(cls);
}

export default withAPIHelper;
