import React, { Fragment } from 'react';
import { Table, Spin, Divider, Button, message } from 'antd';
import request from '../../../utils/request';
import Position from './Position';
// import styles from './ToListBond.css';

const _ = require('lodash');

class ToListBond extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.fetchData();
  }


  fetchData = () => {
    this.setState({ loading: true });
    const pms = request('/api/querytolistingbond');
    pms.then((datas) => {
      this.setState({ data: datas.data, loading: false });
    }).catch(err => ({ err }));
  }

  generateText =() => {
    try {
      const settleday = _.minBy(this.state.data, 'settleDay').settleDay;
      const positionList = _.filter(this.state.data, { settleDay: settleday });
      let newText = '';
      positionList.forEach((item) => {
        newText = `${newText + item.bondcode}\t 买入${item.amount / 10000}  (上市) \n`;
      });
      this.copyToClipboard(newText);
    } catch (err) {
      message.error(err);
    }
  }

  copyToClipboard = (text) => {
    const textField = document.createElement('textarea');
    textField.value = text;
    document.body.appendChild(textField);
    textField.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? '报价成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
      message.success(msg);
      textField.remove();
    } catch (err) {
      message.error('该浏览器不支持点击复制到剪贴板');
      textField.remove();
    }
  }

  render() {
    const columns = [{
      title: '交易员',
      dataIndex: 'trader',
      width: 300,
    }, {
      title: '债券代码',
      dataIndex: 'bondcode',
      width: 300,
    }, {
      title: '债券简称',
      dataIndex: 'bondname',
      width: 300,
    }, {
      title: '数量',
      dataIndex: 'amount',
      width: 300,
      render: text => <h2>{text}</h2>,
    }, {
      title: '结算日',
      dataIndex: 'settleDay',
      width: 300,
      render: text => <h2 style={{ color: 'red' }}>{text}</h2>,
    }, {
      title: '代缴机构',
      dataIndex: 'mediator',
      width: 300,
    }, {
      title: '上市日',
      dataIndex: 'outstandingDay',
      width: 300,
    }, {
      title: '缴款日',
      dataIndex: 'paymentDay',
      width: 300,
    }];


    return (
      <Fragment>
        <Spin spinning={this.state.loading}>
          <Divider><Button type="primary" onClick={this.generateText}>复制最近日期到剪切板</Button></Divider>
          <Table
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
            scroll={{ y: 500 }}
          />
        </Spin>
        <Position />
      </Fragment>
    );
  }
}

export default ToListBond;
