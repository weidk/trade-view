import React from 'react';
import { Table } from 'antd';
import styles from './Deals.css';


const columns = [{
  title: 'orderid',
  dataIndex: 'orderid',
  width: 300,
}, {
  title: 'dealid',
  dataIndex: 'dealid',
  width: 150,
},
{
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
  title: 'dealprice',
  dataIndex: 'dealprice',
  width: 150,
},
{
  title: 'dealamt',
  dataIndex: 'dealqty',
  width: 150,
},
{
  title: 'trader',
  dataIndex: 'trader',
  width: 150,
},
{
  title: 'time',
  dataIndex: 'ordertime',
  width: 150,
},
];

function Deals(props) {
  const { data } = props;
  return (
    <div className={styles.normal}>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ y: 300 }}
        pagination={false}
        size="small"
      />
    </div>
  );
}

export default Deals;
