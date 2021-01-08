import React from 'react';
import fetch from 'dva/fetch';
import { Table, Tag } from 'antd';

class RedeemWarn extends React.Component {
  constructor() {
    super();
    this.state = {
      tableData: [],
    };
  }


  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('/api/getcbondtrigger')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({ tableData: jsonData });
      });
  };


  render() {
    console.warn(this.state.spreadDate);
    const columns = [{
      title: '账户',
      dataIndex: '账户代码',
      filters: [
        { text: '转债方向', value: '转债方向' },
        { text: '风格轮动', value: '风格轮动' },
        { text: '转债策略', value: '转债策略' },
      ],
      onFilter: (value, record) => {
        if (value === '转债方向') {
          return record.账户代码 === '转债方向';
        } else if (value === '风格轮动') {
          return record.账户代码 === '风格轮动';
        } else if (value === '转债策略') {
          return record.账户代码 === '转债策略';
        }
      },
    }, {
      title: '代码',
      dataIndex: 'code',
    },
    {
      title: '转债简称',
      dataIndex: '转债简称',
    },
    {
      title: '赎回触发情况',
      dataIndex: '赎回触发情况',
      render: (text) => {
        if (text === '预警') {
          return <Tag color="orange">{text}</Tag>;
        } else {
          return <Tag color="red">{text}</Tag>;
        }
      },
    },
    {
      title: '进度',
      dataIndex: '进度',
    },
    {
      title: '进度条',
      dataIndex: '进度条',
    },
    {
      title: '转股价值',
      dataIndex: '转股价值',
    },
    {
      title: '转股比例',
      dataIndex: '转股比例',
    },
    {
      title: '转股流动比例',
      dataIndex: '转股流动比例',
    },
    {
      title: '日期',
      dataIndex: 'date',
    },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.tableData}
          pagination={false}
          size="small"
        />
      </div>
    );
  }
}
export default RedeemWarn;
