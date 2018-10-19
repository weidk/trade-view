import React from 'react';
import { Divider, Input } from 'antd';
import fetch from 'dva/fetch';
import styles from './BondLendMain.css';
import BondLendArea from './BondLendArea';

const Search = Input.Search;

class BondLendMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  fetchBondLendData = (values) => {
    try {
      fetch('/api/bondlend', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds });
        });
      });
    } catch (error) {
      console.log('error: ', error);
    }
  }


  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.search}>
          <Search
            placeholder="请输入债券代码"
            enterButton
            size="large"
            onSearch={this.fetchBondLendData}
          />
        </div>
        <Divider />
        <BondLendArea chartdata={this.state.chartdata} />
      </div>
    );
  }
}

export default BondLendMain;
