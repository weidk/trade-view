import React from 'react';
import { Tabs } from 'antd';
// import styles from './ToolMain.css';
import MainMenu from '../Layout/MainMenu';
import MainContent from '../Layout/MainContent';
import Position from './Position/Position';
import PosMain from './SPositions/PosMain';
import ReportMain from './Report/ReportMain';
import SysMonitorMain from './SystemMonitor/SysMonitorMain';
import SaleMain from './Sales/SaleMain'

const TabPane = Tabs.TabPane;

class ToolMain extends React.Component {
  render() {
    return (
      <MainMenu location={this.props.location}>
        <div>
          <MainContent >
            <Tabs defaultActiveKey="1" tabPosition="left">
              <TabPane tab="报头寸" key="1"><Position /></TabPane>
              <TabPane tab="现券持仓" key="2"><PosMain /></TabPane>
              <TabPane tab="投资报表" key="3"><ReportMain /></TabPane>
              <TabPane tab="销售报表" key="4"><SaleMain /></TabPane>
              <TabPane tab="系统监控" key="5"><SysMonitorMain /></TabPane>
            </Tabs>
          </MainContent>
        </div>
      </MainMenu>
    );
  }
}

export default ToolMain;
