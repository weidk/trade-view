import React from 'react';
import { Tabs } from 'antd';
import request from '../../../utils/request';
import styles from './XBondMain.css';
import XBondProfitChart from './XBondProfitChart';
import XBondAmtChart from './XBondAmtChart';

const TabPane = Tabs.TabPane;

class XBondMain extends React.Component {
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
    const pms = request('/api/xbondreport');
    pms.then((datas) => {
      const ds = datas.data;
      this.setState({
        chartdata: ds,
      });
    }).catch(err => ({ err }));
  }

  render() {
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="1" tabPosition="top">
          <TabPane tab="利润走势" key="1">
            <XBondProfitChart data={this.state.chartdata} />
          </TabPane>
          <TabPane tab="做市量走势" key="2">
            <XBondAmtChart data={this.state.chartdata} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default XBondMain;
