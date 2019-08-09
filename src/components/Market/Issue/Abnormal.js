import React from 'react';
import { Table } from 'antd';
import styles from './Abnormal.css';


const columns = [{
  title: '债券简称',
  dataIndex: 'NAME',
},
{
  title: '全场倍数',
  dataIndex: 'FULLMULTIPLE',
},
];

function Abnormal(props) {
  const { data } = props;
  return (
    <div className={styles.normal}>
      <Table
        columns={columns} dataSource={data}
        pagination={false}
        size="middle"
      />
    </div>
  );
}

export default Abnormal;
