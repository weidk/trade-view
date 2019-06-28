import React from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';

class EnsureLoggedInContainer extends React.Component {
  componentDidMount() {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      message.warn('please login in.');
    }
  }

  render() {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return null;
    }
    return this.props.children;
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user,
  };
}

export default connect(mapStateToProps)(EnsureLoggedInContainer);
