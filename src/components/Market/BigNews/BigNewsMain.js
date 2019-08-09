import React from 'react';
import { Tabs } from 'antd';
import request from '../../../utils/request';
import styles from './BigNewsMain.css';
import BigNewsChart from './BigNewsChart';

const R = require('ramda');

const TabPane = Tabs.TabPane;

class BigNewsMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    let ds = [];
    const pms = request('/api/bignews');
    pms.then((datas) => {
      ds = datas.data;
      this.setState({
        chartdata: ds,
      });
    }).catch(err => ({ err }));
  }


  render() {
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="7" >
          <TabPane tab="2013" key="1">
            <BigNewsChart data={R.filter(n => n.DATE < '2014', this.state.chartdata)} />
          </TabPane >
          <TabPane tab="2014" key="2">
            <BigNewsChart data={R.filter(n => n.DATE >= '2014' & n.DATE < '2015', this.state.chartdata)} />
          </TabPane >
          <TabPane tab="2015" key="3" >
            <BigNewsChart data={R.filter(n => n.DATE >= '2015' & n.DATE < '2016', this.state.chartdata)} />
          </TabPane >
          <TabPane tab="2016" key="4" >
            <BigNewsChart data={R.filter(n => n.DATE >= '2016' & n.DATE < '2017', this.state.chartdata)} />
          </TabPane >
          <TabPane tab="2017" key="5" >
            <BigNewsChart data={R.filter(n => n.DATE >= '2017' & n.DATE < '2018', this.state.chartdata)} />
          </TabPane >
          <TabPane tab="2018" key="6" >
            <BigNewsChart data={R.filter(n => n.DATE >= '2018' & n.DATE < '2019', this.state.chartdata)} />
          </TabPane >
          <TabPane tab="2019" key="7" >
            <BigNewsChart data={R.filter(n => n.DATE >= '2019' & n.DATE < '2020', this.state.chartdata)} />
          </TabPane >
        </Tabs>
      </div>
    );
  }
}

export default BigNewsMain;
