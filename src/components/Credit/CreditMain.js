import React from 'react';
import { Tabs } from 'antd';
import MainMenu from '../Layout/MainMenu';
import MainContent from '../Layout/MainContent';
import styles from './CreditMain.css';
import HidenCreditMain from '../Market/HidenCredit/HidenCreditMain';
import CityMain from './City/CityMain';
import TurnOverMain from './TurnOver/TurnOverMain';
import IndustryMain from './Industry/IndustryMain';

const TabPane = Tabs.TabPane;

class CreditMain extends React.Component {
  render() {
    return (
      <MainMenu location={this.props.location}>
        <div className={styles.normal}>
          <MainContent >
            <Tabs defaultActiveKey="1" tabPosition="left">
              <TabPane tab="城投分析" key="1" ><CityMain /></TabPane>
              <TabPane tab="行业分析" key="2" ><IndustryMain /></TabPane>
              <TabPane tab="隐含评级" key="3" ><HidenCreditMain /></TabPane>
              <TabPane tab="信用换手" key="4" ><TurnOverMain /></TabPane>
            </Tabs>
          </MainContent>
        </div>
      </MainMenu>
    );
  }
}

export default CreditMain;
