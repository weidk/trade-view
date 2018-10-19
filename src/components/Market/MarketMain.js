import React from 'react';
// import styles from './MarketMain.css';
import { Tabs } from 'antd';
import MainMenu from '../Layout/MainMenu';
import MainContent from '../Layout/MainContent';
import Issue from './Issue/Issue';
import MarketMakerMain from './MarketMaker/MarketMakerMain';
import DealMain from './SecondMarketDeal/DealMain';
import BondLendMain from './BondLend/BondLendMain';
import BondDealMain from './BondDeal/BondDealMain';
import BpMain from './Bp/BpMain';
import HidenCreditMain from './HidenCredit/HidenCreditMain';

const TabPane = Tabs.TabPane;

class MarketMain extends React.Component {
  render() {
    return (
      <MainMenu location={this.props.location}>
        <div>
          <MainContent >
            <Tabs defaultActiveKey="1" tabPosition="left">
              <TabPane tab="现券成交" key="1" ><DealMain /></TabPane>
              <TabPane tab="做市分数" key="2" ><MarketMakerMain /></TabPane>
              <TabPane tab="一级发行" key="3" ><Issue /></TabPane>
              <TabPane tab="债券借贷" key="4" ><BondLendMain /></TabPane>
              <TabPane tab="成交查询" key="5" ><BondDealMain /></TabPane>
              <TabPane tab="波动监测" key="6" ><BpMain /></TabPane>
              <TabPane tab="隐含评级" key="7" ><HidenCreditMain /></TabPane>
            </Tabs>
          </MainContent>
        </div>
      </MainMenu>
    );
  }
}

export default MarketMain;
