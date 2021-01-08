import React from 'react';
import fetch from 'dva/fetch';
import { Divider, Tag } from 'antd';
import styles from './UnSubTraders.css';


class UnSubTraders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unsubtraders: [],
    };
  }

  componentDidMount() {
    try {
      fetch('/api/unsub', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ unsubtraders: ds });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }


  render() {
    const UnSubstrader = this.state.unsubtraders.map(trader => <Tag color="red">{trader}</Tag>);
    return (
      <div className={styles.normal} >
        <Divider>未提交头寸的有：{UnSubstrader}</Divider>
      </div>
    );
  }
}

export default UnSubTraders;
