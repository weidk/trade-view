import React from 'react';
import { Tabs } from 'antd';
import styles from './CashMain.css';
import NCDBalance from './NCDBalance';
import ExchangeRate from './ExchangeRate';

const TabPane = Tabs.TabPane;

function CashMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="协议回购" key="1" ><ExchangeRate /></TabPane>
        <TabPane tab="NCD余额" key="2" ><NCDBalance /></TabPane>
      </Tabs>
    </div>
  );
}

export default CashMain;
