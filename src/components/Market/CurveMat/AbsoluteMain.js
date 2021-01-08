import React from 'react';
import { Tabs } from 'antd';
import styles from './AbsoluteMain.css';
import AbsoluteCurve from './AbsoluteCurve';
import AdjMain from './Adj/AdjMain';

const TabPane = Tabs.TabPane;

function AbsoluteMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="曲线分位" key="1" ><AbsoluteCurve /></TabPane>
        <TabPane tab="等效曲线" key="2" ><AdjMain /></TabPane>
      </Tabs>
    </div>
  );
}

export default AbsoluteMain;
