import React from 'react';
import { Tabs } from 'antd';
import styles from './PreditMain.css';
import XondIndexMain from './XBondIndex/XondIndexMain';

const TabPane = Tabs.TabPane;
function PreditMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="XB指标" key="1"><XondIndexMain /></TabPane>
      </Tabs>
    </div>
  );
}

export default PreditMain;
