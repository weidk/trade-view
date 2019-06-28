import React from 'react';
import { Table, Popconfirm } from 'antd';
import styles from './TodoTable.css';


class TodoTable extends React.Component {
  render() {
    const { deleteData } = this.props;
    const columns = [{
      title: '创建人',
      dataIndex: 'trader',
      width: 150,
      filters: this.props.traders,
      onFilter: (value, record) => record.trader.indexOf(value) === 0,
    }, {
      title: '提醒内容',
      dataIndex: 'todo',
      width: 400,
    }, {
      title: '提醒时间',
      dataIndex: 'date',
      // sorter: (a, b) => a.date - b.date,
      width: 200,
    }, {
      title: '操作',
      key: 'operation',
      width: 150,
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
        <Table
          columns={columns}
          dataSource={this.props.fetchedData}
          pagination={false}
          scroll={{ y: 500 }}
        />
      </div>
    );
  }
}

export default TodoTable;
