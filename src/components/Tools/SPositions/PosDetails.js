import React from 'react';
import { Table } from 'antd';
import NumberFormat from 'react-number-format';
import styles from './PosDetails.css';

const _ = require('lodash');

class PosDetails extends React.Component {
  columns = [{
    title: '账户',
    dataIndex: 'FundAcc',
    width: 150,
    align: 'right',
    render: text => <h3>{text}</h3>,
    // filters: this.props.showfun.map((t) => {
    //   const Obj = {};
    //   Obj.text = t;
    //   Obj.value = t;
    //   return Obj;
    // }),
    // onFilter: (value, record) => record.FundAcc.includes(value),
  }, {
    title: '债券代码',
    dataIndex: 'SCode',
    width: 150,
    align: 'right',
    render: text => <h3>{text}</h3>,
    // onFilter: (value, record) => record.InvestType.includes(value),
  }, {
    title: '债券简称',
    dataIndex: 'SName',
    width: 150,
    align: 'right',
    render: text => <h3>{text}</h3>,
    // onFilter: (value, record) => record.InvestType.includes(value),
  }, {
    title: '多空',
    dataIndex: 'Direction',
    width: 60,
    align: 'right',
    filters: [
      { text: '多', value: '多' },
      { text: '空', value: '空' },
    ],
    onFilter: (value, record) => record.Direction.includes(value),
    render: text => <h3>{text}</h3>,
    // onFilter: (value, record) => record.InvestType.includes(value),
  },
  {
    title: '数量',
    dataIndex: 'TotalAmount',
    width: 150,
    align: 'right',
    filters: [
      { text: '0', value: 0 },
      { text: '大於0', value: 1 },
    ],
    onFilter: (value, record) => {
      // console.log(value);
      // console.log(record);
      if (value > 0) {
        return record.TotalAmount > 0;
      } else {
        return record.TotalAmount === '0';
      }
    },
    render: (text) => {
      if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(0)} displayType={'text'} thousandSeparator /></div>; } else {
        return <div><NumberFormat value={text.toFixed(0)} displayType={'text'} thousandSeparator /></div>;
      }
    },
  }, {
    title: '收益',
    dataIndex: 'TotalProfit',
    width: 150,
    align: 'right',
    render: (text) => {
      if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
        return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
      }
    },
  },
  ]
  render() {
    const data = _.filter(this.props.tabledata, o => this.props.showfun.includes(o.FundAcc));
    return (
      <div className={styles.normal}>
        <Table
          className={styles.anttable}
          columns={this.columns}
          dataSource={data}
          bordered
          pagination={false}
          scroll={{ y: 800 }}
          size="small"
        />
      </div>
    );
  }
}

export default PosDetails;
