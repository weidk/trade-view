import React from 'react';
import { Table } from 'antd';
import styles from './OrderOver.css';


const columns = [{
  title: 'orderid',
  dataIndex: 'orderid',
  width: 300,
}, {
  title: 'status',
  dataIndex: 'status',
  width: 120,
}, {
  title: 'direction',
  dataIndex: 'direction',
  width: 150,
}, {
  title: 'bondcode',
  dataIndex: 'bondcode',
  width: 150,
}, {
  title: 'price',
  dataIndex: 'price',
  width: 150,
},
{
  title: 'amt',
  dataIndex: 'amt',
  width: 150,
},
{
  title: 'trader',
  dataIndex: 'name',
  width: 150,
},
{
  title: 'time',
  dataIndex: 'ordertime',
  width: 150,
},
];

function OrderOver(props) {
  const { data } = props;
  return (
    <div className={styles.normal}>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ y: 350 }}
        pagination={false}
        size="small"
      />
    </div>
  );
}

export default OrderOver;
