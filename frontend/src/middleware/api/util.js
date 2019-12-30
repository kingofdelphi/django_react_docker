import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ConfirmationModal from '../../components/modal/confirmation';
import Loading from '../../components/loading';
import MessageBox from '../../components/modal/messagebox';

import makeApiCall from './actionCreators';

function withAPIHelper(WrappedComponent) {
  const cls = class extends React.PureComponent {
    state = {
      sessionValid: true,
      redirectToHome: false,
      loading: false,
      serverUp: true,
    }

    invalidateSession = () => {
      this.setState({ sessionValid: false });
    }

    setLoading = (shown) => {
      this.setState({ loading: shown });
    }

    setConnectionStatus = (serverUp) => {
      this.setState({ serverUp });
    };

    apiContext = { 
      invalidateSession: this.invalidateSession,
      setLoading: this.setLoading,
      setConnectionStatus: this.setConnectionStatus,
    }

    render() {
      const { 
        sessionValid,
        redirectToHome,
        loading,
        serverUp,
      } = this.state;

      if (redirectToHome) {
        return (
          <Redirect to='/logout' />
        );
      }
      return (
        <div style={{ height: '100%' }}>
          <WrappedComponent 
            {...this.props}
            makeApiCall={(params) => this.props.dispatch(makeApiCall(params), this.apiContext)} 
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
          { loading && <Loading /> }
          { !serverUp && <MessageBox message="Could not connect to server" onSubmit={() => this.setConnectionStatus(true)} /> }
        </div>
      );
    }
  }
  return connect()(cls);
}

export default withAPIHelper;
