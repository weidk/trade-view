import React from 'react';
import moment from 'moment';
import { Table, Popconfirm } from 'antd';
import styles from './OrderIng.css';


class OrderIng extends React.Component {
  render() {
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
    {
      title: 'option',
      dataIndex: 'operation',
      width: 150,
      render: (text, record) => {
        return (
          <Popconfirm title="确定撤销该委托？" onConfirm={() => this.props.onCancle({ ...record, ordertime: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss') })}>
            <a>撤单</a>
          </Popconfirm>
        );
      },
    },
    ];
    return (
      <div className={styles.normal}>
        <Table
          columns={columns}
          dataSource={this.props.data}
          scroll={{ y: 350 }}
          pagination={false}
          size="small"
        />
      </div>
    );
  }
}

export default OrderIng;
