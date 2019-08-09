import React from 'react';
import { DatePicker, Table } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
// import styles from './DealPosition.css';

const R = require('ramda');

class DealPosition extends React.Component {
  constructor() {
    super();
    this.state = {
      tableData: [],
      filterTraders: [],
    };
  }

  componentDidMount() {
    this.pickerChange(moment());
  }


  getFilters=() => {
    const { tableData } = this.state;
    if (tableData.length > 0) {
      const traders = R.pluck('SELFTRADERNAME')(tableData);
      const filterTrader = R.uniq(traders);
      const traderList = [];
      filterTrader.forEach(d => traderList.push({ text: d, value: d }));
      this.setState({ filterTraders: traderList,
      });
    }
  };

  pickerChange = (values) => {
    try {
      fetch('/api/settledownpositon', {
        method: 'POST',
        body: JSON.stringify(values.format('YYYY-MM-DD')),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ tableData: ds });
          this.getFilters();
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }


  render() {
    const columns = [{
      title: '交易员',
      dataIndex: 'SELFTRADERNAME',
      filters: this.state.filterTraders,
      onFilter: (value, record) => record.SELFTRADERNAME.includes(value),
      width: 300,
    },
    {
      title: '方向',
      dataIndex: 'SIDE',
      width: 300,
    },
    {
      title: '债券代码',
      dataIndex: 'BONDCODE',
      width: 300,
    }, {
      title: '债券简称',
      dataIndex: 'BONDNAME',
      width: 400,
    },
    {
      title: '结算总额（亿）',
      dataIndex: 'SETTLEFACEVALUE',
      width: 300,
    },
    ];


    return (
      <div>
        <h4> 结算日 ：
        <DatePicker onChange={this.pickerChange} defaultValue={moment()} />
        </h4>
        <Table
          columns={columns}
          dataSource={this.state.tableData}
          pagination={false}
          scroll={{ y: 500 }}
          size="middle"
        />
      </div>
    );
  }
}


export default DealPosition;
