import React from 'react';
import { Button } from 'antd';
import fetch from 'dva/fetch';
import request from '../../../utils/request';
import styles from './Position.css';
import PositionTable from './PostionTable';
import PositionModal from './PositionModal';

const R = require('ramda');

const formatDate = (now) => {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  return `${year}-${month}-${date}`;
};

class Position extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filterTraders: [],
      filterDate: [],
      filterCodes: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }


  getFilters=() => {
    const { data } = this.state;
    if (data.length > 0) {
      const traders = R.pluck('trader')(data);
      const filterTrader = R.uniq(traders);
      const traderList = [];
      filterTrader.forEach(d => traderList.push({ text: d, value: d }));
      this.setState({ filterTraders: traderList,
      });

      // const tempTraderSet = new Set();
      // data.forEach(d => tempTraderSet.add({ text: d.trader, value: d.trader }));
      // const tempTraderArr = Array.from(tempTraderSet);

      const tempDateSet = new Set();
      data.forEach(d => tempDateSet.add({ text: formatDate(new Date(d.date)),
        value: d.date }));
      const tempDateArr = Array.from(tempDateSet);

      const tempCodeSet = new Set();
      data.forEach(d => tempCodeSet.add({ text: d.bondcode, value: d.bondcode }));
      const tempCodeArr = Array.from(tempCodeSet);

      this.setState({
        filterDate: Array.from(tempDateArr),
        filterCodes: Array.from(tempCodeArr),
      });
    }
  };


  createHandler = (values) => {
    try {
      fetch('/api/postposition', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(this.fetchData());
    } catch (error) {
      // console.log('error: ', error);
    }
  };

  fetchData = () => {
    const pms = request('/api/position');
    pms.then((datas) => {
      console.warn(datas);
      this.setState({ data: datas.data });
      this.getFilters();
    }).catch(err => ({ err }));
  }

  deleteHandle = (values) => {
    try {
      fetch('/api/deleteposition', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        this.fetchData();
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  };


  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.create}>
          <PositionModal record={{}} onOk={this.createHandler} >
            <Button type="primary">新建持仓</Button>
          </PositionModal>
        </div>
        <PositionTable
          fetchedData={this.state.data} deleteData={this.deleteHandle}
          traders={this.state.filterTraders}
          dates={this.state.filterDate}
          codes={this.state.filterCodes}
        />
      </div>
    );
  }
}

export default Position;
