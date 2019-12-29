import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ConfirmationModal from '../../components/modal/confirmation';

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
      // replacing div with empty tags <> < /> does not work
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
                this.setState({ sessionValid: true });
                this.props.history.push('/logout');
              }}
              onCancel={() => this.setState({ sessionValid: true })}
            /> 
            )
          }
        </div>
      );
    }
  }
  return withRouter(connect()(cls));
}

export default withAPIHelper;
