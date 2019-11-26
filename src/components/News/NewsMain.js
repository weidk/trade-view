import React from 'react';
import { Tabs } from 'antd';
import MainMenu from '../Layout/MainMenu';
import MainContent from '../Layout/MainContent';
import BloomBerg from './BloomBerg';
import styles from './NewsMain.css';

const TabPane = Tabs.TabPane;

class NewsMain extends React.Component {
  render() {
    return (
      <MainMenu location={this.props.location}>
        <div className={styles.normal}>
          <MainContent >
            <Tabs defaultActiveKey="1" tabPosition="left">
              <TabPane tab="彭博新闻" key="1" ><BloomBerg /></TabPane>
            </Tabs>
          </MainContent>
        </div>
      </MainMenu>
    );
  }
}

export default NewsMain;
