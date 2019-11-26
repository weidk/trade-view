import React from 'react';
import { Tabs } from 'antd';
import styles from './SpreadMain.css';
import SpreadTable from './SpreadTable';
import PriceMonitor from './PriceMonitor';

const TabPane = Tabs.TabPane;

class SpreadMain extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="1" tabPosition="top">
          <TabPane tab="组合盈亏" key="1" ><SpreadTable /></TabPane>
          <TabPane tab="价位提醒" key="2" ><PriceMonitor /></TabPane>
        </Tabs>
      </div>
    );
  }
}

export default SpreadMain;
