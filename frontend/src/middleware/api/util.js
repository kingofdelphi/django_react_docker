import React from 'react';
import { connect } from 'react-redux';

import ConfirmationModal from '../../components/modal/confirmation';
import Loading from '../../components/loading';
import MessageBox from '../../components/modal/messagebox';

import { logoutUser } from '../../store/login_info/actionCreators';

import makeApiCall from './actionCreators';

const mapStateToProps = state => ({
  loginInfo: state.loginInfo,
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  dispatch,
});

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

      const { loginInfo } = this.props;

      return (
        <>
          <WrappedComponent 
            {...this.props}
            makeApiCall={(params) => this.props.dispatch(makeApiCall(params), this.apiContext)} 
          />
          {
            !sessionValid && loginInfo.username && (
              <ConfirmationModal 
                message="Session is invalid. Do you want to log out ?." 
                onSubmit={() => {
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
  return connect(mapStateToProps, mapDispatchToProps)(cls);
}

export default withAPIHelper;
