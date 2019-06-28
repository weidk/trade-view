import React from 'react';
import { Table } from 'antd';
// import styles from './BPMPosition.css';
import request from '../../../utils/request';

const R = require('ramda');

class BPMPosition extends React.Component {
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
       // const tempTraderSet = new Set();
       // data.forEach(d => tempTraderSet.add({ text: d.DEALUSERNAME, value: d.DEALUSERNAME }));
       // const tempTraderArr = Array.from(tempTraderSet);
       // this.setState({ filterTraders: Array.from(tempTraderArr) });

       const traders = R.pluck('DEALUSERNAME')(data);
       const filterTrader = R.uniq(traders);
       const traderList = [];
       filterTrader.forEach(d => traderList.push({ text: d, value: d }));
       this.setState({ filterTraders: traderList,
       });
     }
   };


  fetchData = () => {
    const pms = request('/api/bpmpositon');
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
      onFilter: (value, record) => record.DEALUSERNAME.includes(value),
      width: 300,
    }, {
      title: '债券代码',
      dataIndex: 'BONDCODE',
      width: 300,
    }, {
      title: '债券简称',
      dataIndex: 'BONDNAME',
      width: 400,
    }, {
      title: '可用持仓',
      dataIndex: 'AVAILABLEFACEVALUE',
      width: 300,
      filters: [
        { text: '0', value: 0 },
        { text: '大於0', value: 1 },
      ],
      onFilter: (value, record) => {
        // console.log(value);
        // console.log(record);
        if (value > 0) {
          return record.AVAILABLEFACEVALUE > 0;
        } else {
          return record.AVAILABLEFACEVALUE === '0';
        }
      },
    },
    {
      title: '总持仓',
      dataIndex: 'TOTALFACEVALUE',
      width: 300,
    },
    ];


    return (
      <Table
        columns={columns}
        dataSource={this.state.data}
        pagination={false}
        scroll={{ y: 500 }}
      />
    );
  }
}
export default BPMPosition;
