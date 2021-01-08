import React from 'react';
import { Tabs } from 'antd';
import ProfitChart from './ProfitChart';
import PositionPie from './PositionPie';
import ProfitReason from './ProfitReason';
import FF from './FF';
import ProfitTable from '../SPositions/ProfitTable';
import DrawDown from './DrawDown';
import IRSMain from './IRS/IRSMain';
// import AccMain from './Acc/AccMain';

// import styles from './ReportMain.css';

const TabPane = Tabs.TabPane;

class ReportMain extends React.Component {
  render() {
    return (<Tabs defaultActiveKey="1" tabPosition="top">
      <TabPane tab="业绩走势" key="1"><ProfitChart /></TabPane>
      <TabPane tab="风控报表" key="2"><ProfitTable /></TabPane>
      <TabPane tab="风控指标" key="3"><DrawDown /></TabPane>
      <TabPane tab="互换指标" key="4"><IRSMain /></TabPane>
      <TabPane tab="持仓分布" key="5"><PositionPie /></TabPane>
      <TabPane tab="业绩分布" key="6"><ProfitReason /></TabPane>
      <TabPane tab="FF统计" key="7"><FF /></TabPane>
      {/* <TabPane tab="策略明细" key="4"><AccMain /></TabPane>*/}
    </Tabs>);
  }
}

export default ReportMain;
