import React from 'react';
import { Tabs } from 'antd';
import Position from './Position';
import SettleMain from './SettleMain';
import HistorySettle from './HistorySettle';
import styles from './PositionMain.css';

const TabPane = Tabs.TabPane;

function PositionMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="下交易日结算" key="1" ><SettleMain /></TabPane>
        <TabPane tab="远期头寸" key="2" ><Position /></TabPane>
        <TabPane tab="历史查询" key="3" ><HistorySettle /></TabPane>
      </Tabs>
    </div>
  );
}

export default PositionMain;
