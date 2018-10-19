import React from 'react';
import { Table } from 'antd';
// import styles from './CDPosition.css';
import request from '../../../utils/request';

const formatDate = (now) => {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  return `${year}-${month}-${date}`;
};

class CDPosition extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filterTraders: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }

   getFilters=() => {
     const { data } = this.state;
     if (data.length > 0) {
       const tempTraderSet = new Set();
       data.forEach(d => tempTraderSet.add({ text: d.DEALUSERNAME, value: d.DEALUSERNAME }));
       const tempTraderArr = Array.from(tempTraderSet);
       this.setState({ filterTraders: Array.from(tempTraderArr) });
     }
   };


  fetchData = () => {
    const pms = request('/api/cdpositon');
    pms.then((datas) => {
      this.setState({ data: datas.data });
      this.getFilters();
    }).catch(err => ({ err }));
  }

  render() {
    const columns = [{
      title: '交易员',
      dataIndex: 'DEALUSERNAME',
      filters: this.state.filterTraders,
      onFilter: (value, record) => record.DEALUSERNAME.indexOf(value) === 0,
    }, {
      title: '债券代码',
      dataIndex: 'BONDCODE',
    }, {
      title: '债券简称',
      dataIndex: 'BONDNAME',
    }, {
      title: '数量',
      dataIndex: 'FACEVALUE',
    }, {
      title: '起始日',
      dataIndex: 'BEGINDATE',
      render: (text) => {
        const d = new Date(text);
        return (formatDate(d));
      },
    },
    {
      title: '资金成本',
      dataIndex: 'FundCost',
    }, {
      title: '保本收益',
      dataIndex: 'COSTYIELD',
    }];


    return (
      <Table columns={columns} dataSource={this.state.data} pagination={false} />
    );
  }
}

export default CDPosition;
