import React from 'react';
import { Tabs } from 'antd';
import MarketScore from './MarketScore';
import MarketMakerDealChart from './MarketMakerDealChart';
import CreditMarketMaker from './CreditMarketMaker';
import XBondCounterMain from './XBondCounter/XBondCounterMain';


const TabPane = Tabs.TabPane;

class MarketMakerMain extends React.Component {
  render() {
    return (<Tabs defaultActiveKey="1" tabPosition="top">
      <TabPane tab="报价分数" key="1"><MarketScore /></TabPane>
      <TabPane tab="成交量" key="2"><MarketMakerDealChart /></TabPane>
      <TabPane tab="信用做市" key="3"><CreditMarketMaker /></TabPane>
      <TabPane tab="XBond主力" key="4"><XBondCounterMain /></TabPane>
    </Tabs>);
  }
}


export default MarketMakerMain;
