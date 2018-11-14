import React from 'react';
import { Tabs } from 'antd';
import styles from './SaleMain.css';
import Allocate from './AllocateMomentem/Allocate';
import TraderRank from './Trader/TraderRank';
import InstituteRank from './Institute/InstituteRank';
import RelativeMain from './Relative/RelativeMain';
import BankMain from './Bank/BankMain';

const TabPane = Tabs.TabPane;

function SaleMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="获配走势" key="1"><Allocate /></TabPane>
        <TabPane tab="销售排名" key="2"><TraderRank /></TabPane>
        <TabPane tab="机构排名" key="3"><InstituteRank /></TabPane>
        <TabPane tab="机构粘性" key="4"><RelativeMain /></TabPane>
        <TabPane tab="银行明细" key="5"><BankMain /></TabPane>
      </Tabs>
    </div>
  );
}

export default SaleMain;
