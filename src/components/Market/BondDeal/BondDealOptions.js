import React from 'react';
import { Input, DatePicker, Row, Col, Tag } from 'antd';
import moment from 'moment';
import styles from './BondDealOptions.css';

const Search = Input.Search;

class BondDealOptions extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <Row type="flex" align="bottom">
          <Col span={4}>
            <DatePicker size="large" onChange={this.props.pickerChange} defaultValue={moment()} />
          </Col>
          <Col span={6} push={1}><Search
            placeholder="请输入债券代码或简称..."
            enterButton
            size="large"
            onSearch={this.props.fetchData}
          /></Col>
          <Col span={9} push={3}>
            <span>
              平均收益：<Tag color="#1DA57A">{this.props.yield}</Tag>
              总成交量：<Tag color="#1DA57A">{this.props.amt}</Tag>亿
              成交：<Tag color="#1DA57A">{this.props.dealcounts}</Tag> 笔
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BondDealOptions;
