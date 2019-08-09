import React from 'react';
import { Table } from 'antd';
import styles from './ReviewDetail.css';

const columns = [{
  title: '收益回撤比',
  dataIndex: 'Returnperdrawdown',
  render: text => (
    <span>
      {text}
    </span>
  ),
},
{
  title: '年化收益',
  dataIndex: 'YearlyReturn',
  render: text => (
    <span>
      {text} %
    </span>
  ),
},
{
  title: '交易次数',
  dataIndex: 'DealTimes',
},
{
  title: '胜率',
  dataIndex: 'WinRate',
  render: text => (
    <span>
      {text} %
    </span>
  ),
},
{
  title: '最大回撤',
  dataIndex: 'MaxDrawDown',
  render: text => (
    <span>
      {text} %
    </span>
  ),
}, {
  title: '波动率',
  dataIndex: 'Volatility',
  render: text => (
    <span>
      {text} %
    </span>
  ),
},
];

function ReviewDetail(props) {
  const { data } = props;
  return (
    <div className={styles.normal}>
      <Table
        columns={columns} dataSource={data}
        pagination={false}
        size="large"
      />
    </div>
  );
}

export default ReviewDetail;
