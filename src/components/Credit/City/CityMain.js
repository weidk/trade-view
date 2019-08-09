import React from 'react';
import { Tabs } from 'antd';
import styles from './CityMain.css';
import CityProvince from './CityProvince';

const TabPane = Tabs.TabPane;

class CityMain extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="1" tabPosition="top">
          <TabPane tab="成交地图" key="1" ><CityProvince /></TabPane>
        </Tabs>
      </div>
    );
  }
}

export default CityMain;
