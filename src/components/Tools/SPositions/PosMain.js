import React from 'react';
import { Tabs } from 'antd';
import styles from './PosMain.css';
import CDPosition from './CDPosition';
import BPMPosition from './BPMPosition';
import DealPosition from './DealPosition';


const TabPane = Tabs.TabPane;

function PosMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="结算头寸" key="1"><DealPosition /></TabPane>
        <TabPane tab="BPM持仓" key="2"><BPMPosition /></TabPane>
        <TabPane tab="CD持仓" key="3"><CDPosition /></TabPane>
      </Tabs>
    </div>
  );
}

export default PosMain;
