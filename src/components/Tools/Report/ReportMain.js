import React from 'react';
import { Tabs } from 'antd';
import ProfitChart from './ProfitChart';
import PositionPie from './PositionPie';
import ProfitReason from './ProfitReason';
import AccMain from './Acc/AccMain';

// import styles from './ReportMain.css';

const TabPane = Tabs.TabPane;

class ReportMain extends React.Component {
  render() {
    return (<Tabs defaultActiveKey="1" tabPosition="top">
      <TabPane tab="业绩走势" key="1"><ProfitChart /></TabPane>
      <TabPane tab="持仓分布" key="2"><PositionPie /></TabPane>
      <TabPane tab="业绩分布" key="3"><ProfitReason /></TabPane>
      <TabPane tab="策略明细" key="4"><AccMain /></TabPane>
    </Tabs>);
  }
}

export default ReportMain;
