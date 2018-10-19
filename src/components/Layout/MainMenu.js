import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'dva/router';
// import styles from './MainMenu.css';


const { Header } = Layout;


class MainMenu extends React.Component {
  render() {
    return (
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[this.props.location.pathname]}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="/"><Link to="/">主页</Link></Menu.Item>
            <Menu.Item key="/tools"><Link to="tools">工具</Link></Menu.Item>
            <Menu.Item key="/market"><Link to="market">市场</Link></Menu.Item>
            <Menu.Item key="/trade"><Link to="trade">交易</Link></Menu.Item>
          </Menu>
        </Header>
        {this.props.children}
      </Layout>
    );
  }
}
export default MainMenu;
