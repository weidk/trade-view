import React from 'react';
import NumberFormat from 'react-number-format';
import { Table, Divider } from 'antd';
import fetch from 'dva/fetch';
// import styles from './IRSNominalPrinciple.css';

class IRSNominalPrinciple extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.columns = [
      {
        title: '本方交易员',
        dataIndex: '本方交易员',
        align: 'right',
      },
      {
        title: '剩余名义本金_亿元',
        dataIndex: '剩余名义本金_亿元',
        align: 'right',
        render: (text) => {
          if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
            return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
          }
        },
      },
    ];
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('/api/irsnomialprinciple')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({ data: jsonData });
      });
  };

  render() {
    return (
      <div>
        <Divider> 剩余名义本金 </Divider>
        <Table
          columns={this.columns}
          dataSource={this.state.data}
          bordered
          pagination={false}
          size="small"
        />
      </div>
    );
  }
}

export default IRSNominalPrinciple;
