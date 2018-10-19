import React from 'react';
import { Table, Popconfirm } from 'antd';
import styles from './PostionTable.css';

const formatDate = (now) => {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  return `${year}-${month}-${date}`;
};


class PostionTable extends React.Component {
  render() {
    const { deleteData } = this.props;
    const columns = [{
      title: '交易员',
      dataIndex: 'trader',
      filters: this.props.traders,
      onFilter: (value, record) => record.trader.indexOf(value) === 0,
    }, {
      title: '债券代码/简称',
      dataIndex: 'bondcode',
      filters: this.props.codes,
      onFilter: (value, record) => record.bondcode.indexOf(value) === 0,
    }, {
      title: '备注',
      dataIndex: 'bondname',
    }, {
      title: '数量',
      dataIndex: 'amt',
      render: text => <div style={{ color: text > 0 ? 'black' : 'red' }}>{text}</div>,
    }, {
      title: '结算日',
      dataIndex: 'date',
      filters: this.props.dates,
      onFilter: (value, record) => record.date.indexOf(value) === 0,
      render: (text) => {
        const d = new Date(text);
        return (formatDate(d));
      },
    }, {
      title: '操作',
      key: 'operation',
      render: (text) => {
        return (<span className={styles.operation}>
          <Popconfirm title="确定删除?" onConfirm={() => deleteData({ id: text.id })}>
            <a href="">删除</a>
          </Popconfirm>
        </span>);
      },
    }];
    return (
      <div className={styles.normal}>
        <Table columns={columns} dataSource={this.props.fetchedData} pagination={false} />
      </div>
    );
  }
}

export default PostionTable;
