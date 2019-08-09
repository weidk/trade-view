import React from 'react';
import { Tabs } from 'antd';
import styles from './IssueMain.css';
import Issue from './Issue.js';
import QualificationTs from './QualificationTs.js';
import EmotionTs from './EmotionTs.js';

const TabPane = Tabs.TabPane;

function IssueMain() {
  return (
    <div className={styles.normal}>
      <Tabs defaultActiveKey="1" tabPosition="top">
        <TabPane tab="利率走廊" key="1" ><Issue /></TabPane>
        <TabPane tab="资质指数" key="2" ><QualificationTs /></TabPane>
        <TabPane tab="情绪指数" key="3" ><EmotionTs /></TabPane>
      </Tabs>
    </div>
  );
}

export default IssueMain;
