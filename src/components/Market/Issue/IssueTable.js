import React from 'react';
import { Table, Tag } from 'antd';
import styles from './IssueTable.css';

const columns = [{
  title: '评级',
  dataIndex: 'rank',
  width: 150,
  filters: [
    { text: 'AA-', value: 'AA-' },
    { text: 'AA', value: 'AA' },
    { text: 'AA+', value: 'AA+' },
    { text: 'AAA', value: 'AAA' },
  ],
  onFilter: (value, record) => record.rank === value,
}, {
  title: '期限',
  dataIndex: 'term',
  width: 150,
  filters: [
    { text: '0.25', value: '0.25' },
    { text: '0.5', value: '0.5' },
    { text: '0.75', value: '0.75' },
    { text: '1', value: '1' },
    { text: '2', value: '2' },
    { text: '3', value: '3' },
    { text: '5', value: '5' },
  ],
  onFilter: (value, record) => parseFloat(record.term) === parseFloat(value),
}, {
  title: '收益率区间',
  dataIndex: 'yield',
  width: 200,
  render: text => (
    <span>
      <Tag color="green">{text[1]}</Tag> ~ <Tag color="red">{text[0]}</Tag>
    </span>
  ),
}, {
  title: '债券简称',
  dataIndex: 'bondname',
  width: 200,
  render: text => (
    <span>
      <Tag color="green">{text[1]}</Tag> ~ <Tag color="red">{text[0]}</Tag>
    </span>
  ),
},
];

function IssueTable(props) {
  const { data } = props;
  return (
    <div className={styles.normal}>
      <Table
        columns={columns} dataSource={data}
        pagination={false}
        size="small"
      />
    </div>
  );
}

export default IssueTable;
