import React from 'react';
import { connect } from 'react-redux';

import ConfirmationModal from '../../components/modal/confirmation';
import Loading from '../../components/loading';
import MessageBox from '../../components/modal/messagebox';

import { logoutUser } from '../../store/login_info/actionCreators';

import makeApiCall from './actionCreators';

function withAPIHelper(WrappedComponent) {
  const cls = class extends React.PureComponent {
    state = {
      sessionValid: true,
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
        loading,
        serverUp,
      } = this.state;

      return (
        <>
          <WrappedComponent 
            {...this.props}
            makeApiCall={
              (params, success_callback, failure_callback) => this.props.dispatch(makeApiCall(params), success_callback, failure_callback, this.apiContext)
            } 
          />
          {
            !sessionValid && (
              <ConfirmationModal 
                message="Session is invalid. Do you want to log out ?." 
                onSubmit={() => {
                  this.setState({ sessionValid: true });
                  this.props.logoutUser();
                }}
                onCancel={() => this.setState({ sessionValid: true })}
              /> 
            )
          }
          { loading && <Loading /> }
          { !serverUp && <MessageBox message="Could not connect to server" onSubmit={() => this.setConnectionStatus(true)} /> }
        </>
      );
    }
  }

  const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    logoutUser: () => dispatch(logoutUser()),
  });
  return connect(null, mapDispatchToProps)(cls);
}

export default withAPIHelper;
