import React from 'react';
import { Table } from 'antd';
import request from '../../../utils/request';
// import styles from './ToListBond.css';


class ToListBond extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }


  fetchData = () => {
    const pms = request('/api/querytolistingbond');
    pms.then((datas) => {
      this.setState({ data: datas.data });
    }).catch(err => ({ err }));
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
      <Table
        columns={columns}
        dataSource={this.state.data}
        pagination={false}
        scroll={{ y: 500 }}
      />
    );
  }
}

export default ToListBond;
