import React from 'react';
import { Tag, Table } from 'antd';
import styles from './HidenDateTable.css';

const columns = [{
  title: '简称',
  dataIndex: 'NAME',
  width: 150,
}, {
  title: '代码',
  dataIndex: 'CODE',
  width: 100,
}, {
  title: '发行人',
  dataIndex: 'ISSUER',
  width: 200,
}, {
  title: '旧评级',
  dataIndex: 'OLDCREDIT',
  width: 60,
}, {
  title: '评级日1',
  dataIndex: 'DAY1',
  width: 100,
},
{
  title: '新评级',
  dataIndex: 'NEWCREDIT',
  width: 60,
}, {
  title: '评级日2',
  dataIndex: 'DAY2',
  width: 100,
},
{
  title: '中债估值',
  dataIndex: 'EYIELD',
  width: 100,
},
{
  title: '剩余期限',
  dataIndex: 'RESTYEAR',
  width: 100,
},
{
  title: '评级变动',
  dataIndex: 'change',
  width: 100,
  filters: [
    { text: '上调', value: '上调' },
    { text: '下调', value: '下调' },
  ],
  onFilter: (value, record) => record.change === value,
  render: (text) => {
    if (text === '上调') {
      return <Tag color="green">{text}</Tag>;
    } else {
      return <Tag color="red">{text}</Tag>;
    }
  },
},
];

function HidenDateTable(props) {
  const { data, changehistory } = props;
  return (
    <div className={styles.normal}>
      <Table
        columns={columns} dataSource={data}
        scroll={{ y: 500 }} pagination={false}
        size="small"
        onRow={(record) => {
          return {
            onClick: () => changehistory(record), // 点击行
          };
        }}
      />
    </div>
  );
}

export default HidenDateTable;
