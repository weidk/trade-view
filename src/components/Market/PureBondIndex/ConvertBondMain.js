import React from 'react';
import { Tabs } from 'antd';
import PureBondIndexMain from './PureBondIndexMain';
import ConvertBondRatioNew from './ConvertBondRatioNew';
import ConvertBondHistory from './ConvertBondHistory';
import RedeemWarn from './RedeemWarn';
import styles from './ConvertBondMain.css';

const TabPane = Tabs.TabPane;

class ConvertBondMain extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="1" tabPosition="top">
          <TabPane tab="纯债指数" key="1" ><PureBondIndexMain /></TabPane>
          <TabPane tab="溢价波动" key="2" ><ConvertBondRatioNew /></TabPane>
          <TabPane tab="个券历史" key="3" ><ConvertBondHistory /></TabPane>
          <TabPane tab="赎回预警" key="4" ><RedeemWarn /></TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ConvertBondMain;
