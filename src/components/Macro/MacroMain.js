import React from 'react';
import { Tabs } from 'antd';
import MainMenu from '../Layout/MainMenu';
import MainContent from '../Layout/MainContent';
import styles from './MacroMain.css';
import ReviewMain from './MacroReview/ReviewMain';
import PreditMain from './Predit/PreditMain';

const TabPane = Tabs.TabPane;

class MacroMain extends React.Component {
  render() {
    return (
      <MainMenu location={this.props.location}>
        <div className={styles.normal}>
          <MainContent >
            <Tabs defaultActiveKey="1" tabPosition="left">
              <TabPane tab="策略回测" key="1" ><ReviewMain /></TabPane>
              <TabPane tab="预测指标" key="2" ><PreditMain /></TabPane>
            </Tabs>
          </MainContent>
        </div>
      </MainMenu>
    );
  }
}


export default MacroMain;
