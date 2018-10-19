import React from 'react';
import { Tabs } from 'antd';
import MainMenu from '../Layout/MainMenu';
import MainContent from '../Layout/MainContent';
import MMMain from './MarketMakerTrade/MMMain';
import styles from './TradeMain.css';

const TabPane = Tabs.TabPane;

class TradeMain extends React.Component {
  render() {
    return (
      <MainMenu location={this.props.location}>
        <div className={styles.normal}>
          <MainContent >
            <Tabs defaultActiveKey="1" tabPosition="left">
              <TabPane tab="做市交易" key="1" ><MMMain /></TabPane>
            </Tabs>
          </MainContent>
        </div>
      </MainMenu>
    );
  }
}


export default TradeMain;
