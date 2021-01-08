import React from 'react';
import { Tabs } from 'antd';
import MainMenu from '../Layout/MainMenu';
import MainContent from '../Layout/MainContent';
import IssueMain from './Issue/IssueMain';
import MarketMakerMain from './MarketMaker/MarketMakerMain';
import DealTab from './SecondMarketDeal/DealTab';
import BondLendMain from './BondLend/BondLendMain';
import BondDealMain from './BondDeal/BondDealMain';
import BpMain from './Bp/BpMain';
import BigNewsMain from './BigNews/BigNewsMain';
import ConvertBondMain from './PureBondIndex/ConvertBondMain';
import FutureMain from './Future/FutureMain';
import ReletiveCurve from './CurveMat/ReletiveCurve';
import AbsoluteMain from './CurveMat/AbsoluteMain';
import CBReletiveMain from './CurveMat/CBReletiveMain';
import BSMain from './BondScatter/BSMain';
import SpreadMain from './Spread/SpreadMain';
import CashMain from './Cash/CashMain';

const TabPane = Tabs.TabPane;

class MarketMain extends React.Component {
  render() {
    return (
      <MainMenu location={this.props.location}>
        <div>
          <MainContent >
            <Tabs defaultActiveKey="1" tabPosition="left">
              <TabPane tab="现券成交" key="1" ><DealTab /></TabPane>
              <TabPane tab="资金市场" key="2" ><CashMain /></TabPane>
              <TabPane tab="一级发行" key="3" ><IssueMain /></TabPane>
              <TabPane tab="债券借贷" key="4" ><BondLendMain /></TabPane>
              <TabPane tab="成交查询" key="5" ><BondDealMain /></TabPane>
              <TabPane tab="波动监测" key="6" ><BpMain /></TabPane>
              <TabPane tab="转债监测" key="7" ><ConvertBondMain /></TabPane>
              <TabPane tab="期货持仓" key="8" ><FutureMain /></TabPane>
              <TabPane tab="大事件" key="9" ><BigNewsMain /></TabPane>
              <TabPane tab="相对价值" key="10" ><ReletiveCurve /></TabPane>
              <TabPane tab="绝对价值" key="11" ><AbsoluteMain /></TabPane>
              <TabPane tab="转债价值" key="12" ><CBReletiveMain /></TabPane>
              <TabPane tab="个券散点" key="13" ><BSMain /></TabPane>
              <TabPane tab="利差监控" key="14" ><SpreadMain /></TabPane>
              <TabPane tab="做市分数" key="15" ><MarketMakerMain /></TabPane>
            </Tabs>
          </MainContent>
        </div>
      </MainMenu>
    );
  }
}

export default MarketMain;
