import React from 'react';
import { Tabs } from 'antd';
import CalPosition from './CalPosition';
import SettleMain from './SettleMain';
import HistorySettle from './HistorySettle';
import ToListBond from './ToListBond';
import styles from './PositionMain.css';

const TabPane = Tabs.TabPane;

function PositionMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="下交易日结算" key="1" ><SettleMain /></TabPane>
        <TabPane tab="头寸统计" key="2" ><CalPosition /></TabPane>
        <TabPane tab="历史查询" key="3" ><HistorySettle /></TabPane>
        <TabPane tab="待上市券" key="4" ><ToListBond /></TabPane>
      </Tabs>
    </div>
  );
}

export default PositionMain;
