import React from 'react';
import { Tabs } from 'antd';
import FuturePosition from './FuturePosition';
import MainPosition from './MainPosition';
import styles from './FutureMain.css';

const TabPane = Tabs.TabPane;

function FutureMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="主力持仓" key="1" ><MainPosition /></TabPane>
        <TabPane tab="持仓变动" key="2" ><FuturePosition /></TabPane>
      </Tabs>
    </div>
  );
}

export default FutureMain;
