import React from 'react';
import { Layout } from 'antd';
import styles from './MainContent.css';

const { Content } = Layout;

class MainContent extends React.Component {
  render() {
    return (
      <div className={styles.normal} >
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 580 }}>{this.props.children}
          </Content>
        </Layout>
      </div>
    );
  }
}

export default MainContent;
