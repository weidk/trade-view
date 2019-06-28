import React from 'react';
import { Divider, Input, Button, Row, Col } from 'antd';
import fetch from 'dva/fetch';
import request from '../../../utils/request';
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
      // console.log('error: ', error);
    }
  }

  fetchGKData = () => {
    const pms = request('/api/bondlendgk');
    pms.then((datas) => {
      const ds = datas.data;
      this.setState({
        chartdata: ds,
      });
    }).catch(err => ({ err }));
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.search}>
          <Row gutter={16}>
            <Col span={16}>
              <Search
                placeholder="请输入债券代码"
                enterButton
                size="large"
                onSearch={this.fetchBondLendData}
              />
            </Col>
            <Col span={4} offset={2}>
              <Button shape="round" type="primary" size="large" onClick={this.fetchGKData}>十年国开</Button>
            </Col>
          </Row>
        </div>
        <Divider />
        <BondLendArea chartdata={this.state.chartdata} />
      </div>
    );
  }
}

export default BondLendMain;
