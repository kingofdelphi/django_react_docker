import React from 'react';
import { connect } from 'react-redux';

import styles from './styles.module.scss';

class Profile extends React.Component {
  render() {
    const {
      username
    } = this.props.loginInfo;

    return (
      <div className={styles.main}>Username - {username}</div>
    )
  }
}

const mapStateToProps = state => ({ 
  loginInfo: state.loginInfo,
});

export default connect(mapStateToProps, null)(Profile);
