import React from 'react';
import fetch from 'dva/fetch';
import { Table, Row, Col, Divider } from 'antd';
import NumberFormat from 'react-number-format';

class BondReport extends React.Component {
  constructor() {
    super();
    this.state = {
      flowDate: [],
      spreadDate: [],
      reportDate: '',
    };
  }


  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('/api/getbondflow')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({ flowDate: jsonData });
      });
    fetch('/api/getspread')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({ spreadDate: jsonData, reportDate: jsonData[0].Date });
      });
  };


  render() {
    console.warn(this.state.spreadDate);
    const columns = [{
      title: '代码',
      dataIndex: 'BondCode',
    },
    {
      title: '成交笔数',
      dataIndex: 'DealTimes',
    },
    {
      title: '最新价差(BP)',
      dataIndex: 'LatestSpread',
    },
    {
      title: '最大价差(BP)',
      dataIndex: 'MaxSpread',
    },
    {
      title: '最小价差(BP)',
      dataIndex: 'MinSpread',
    },
    {
      title: '最新价格',
      dataIndex: 'LatestPrice',
    },
    ];

    const columns1 = [{
      title: '新券',
      dataIndex: 'NewBond',
    },
    {
      title: '老券',
      dataIndex: 'OldBond',
    },
    {
      title: '当前利差(BP)',
      dataIndex: 'CurrentSpread',
    },
    {
      title: '最大利差(BP)',
      dataIndex: 'MaxSpread',
    },
    {
      title: '最小价差(BP)',
      dataIndex: 'MinSpread',
    },
    {
      title: '分位数(%)',
      dataIndex: 'PercentileMin',
      render: text => <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>,
    },
    {
      title: '统计天数',
      dataIndex: 'TimeRange',
    },
    ];
    return (
      <div>
        <Row>
          <Col span={11}>
            <Divider> 现券 </Divider>
            <Table
              columns={columns}
              dataSource={this.state.flowDate}
              pagination={false}
              size="small"
            /></Col>
          <Col span={2}><Divider> {this.state.reportDate} </Divider></Col>
          <Col span={11}><Divider> 利差 </Divider>
            <Table
              columns={columns1}
              dataSource={this.state.spreadDate}
              pagination={false}
              size="small"
            /></Col>
        </Row>
      </div>
    );
  }
}
export default BondReport;
