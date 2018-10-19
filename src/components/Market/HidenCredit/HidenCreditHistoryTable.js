import React from 'react';
import { Tag, Table } from 'antd';
import styles from './HidenCreditHistoryTable.css';

const columns = [{
  title: '代码',
  dataIndex: 'CODE',
  width: 100,
}, {
  title: '评级日',
  dataIndex: 'TDDATE',
  width: 100,
},
{
  title: '隐含评级',
  dataIndex: 'HIDENCREDIT',
  width: 100,
}, {
  title: '中债估值',
  dataIndex: 'EYIELD',
  width: 100,
},
{
  title: '评级变动',
  dataIndex: 'CHANGE',
  width: 100,
  render: (text) => {
    if (text === '上调') {
      return <Tag color="green">{text}</Tag>;
    } else if (text === '下调') {
      return <Tag color="red">{text}</Tag>;
    } else {
      return <Tag>{text}</Tag>;
    }
  },
},
];

function HidenCreditHistoryTable(props) {
  const { data, load } = props;
  return (
    <div className={styles.normal}>
      <Table
        columns={columns} dataSource={data}
        pagination={false}
        size="small"
        loading={load}
      />
    </div>
  );
}

export default HidenCreditHistoryTable;
