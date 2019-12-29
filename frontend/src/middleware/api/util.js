import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MessageBox from '../../components/modal/messagebox';

import makeApiCall from './actionCreators';

function withAPIHelper(WrappedComponent) {
  const cls = class extends React.PureComponent {
    state = {
      sessionValid: true,
    }

    invalidateSession = () => {
      this.setState({ sessionValid: false });
    }

    render() {
      const { sessionValid } = this.state;
      return (
        <>
          <WrappedComponent 
            {...this.props}
            makeApiCall={(params) => this.props.dispatch(makeApiCall(params), { invalidateSession: this.invalidateSession })} 
          />
          {
            !sessionValid && (
            <MessageBox 
              message="Session is invalid. You need to log out." 
              onSubmit={() => {
                this.setState({ sessionValid: true });
                // bug: if i use the below line, modal still remains visible
                // this.props.history.push('/logout');
              }}
            /> 
            )
          }
        </>
      );
    }
  }
  return withRouter(connect()(cls));
}

export default withAPIHelper;
