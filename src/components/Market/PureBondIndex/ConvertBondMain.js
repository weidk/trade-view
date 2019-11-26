import React from 'react';
import { Tabs } from 'antd';
import PureBondIndexMain from './PureBondIndexMain';
import ConvertBondRatio from './ConvertBondRatio';
import ConvertBondHistory from './ConvertBondHistory';
import styles from './ConvertBondMain.css';

const TabPane = Tabs.TabPane;

class ConvertBondMain extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="1" tabPosition="top">
          <TabPane tab="纯债指数" key="1" ><PureBondIndexMain /></TabPane>
          <TabPane tab="转股溢价" key="2" ><ConvertBondRatio /></TabPane>
          <TabPane tab="个券历史" key="3" ><ConvertBondHistory /></TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ConvertBondMain;
