import React from 'react';
import { Tabs } from 'antd';
import styles from './PosMain.css';
import CDPosition from './CDPosition';
import BPMPosition from './BPMPosition';

const TabPane = Tabs.TabPane;

function PosMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="CD持仓" key="1"><CDPosition /></TabPane>
        <TabPane tab="BPM持仓" key="2"><BPMPosition /></TabPane>
      </Tabs>
    </div>
  );
}

export default PosMain;
