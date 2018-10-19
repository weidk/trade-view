import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import { message } from 'antd';


function requireAuth(Layout, props) {
  const storage = window.localStorage;
  const isLogin = storage.getItem('login');
  if (isLogin) { // 登录成功
    return <Layout {...props} />;
  } else {
    message.warning('请先登录获取访问权限');
    return <Redirect to="/" />;
  }
}


function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    component: () => import('./components/Home/IndexPage'),
  });

  const TradeSystem = dynamic({
    app,
    component: () => import('./components/Trade/TradeMain'),
  });

  const ToolsMain = dynamic({
    app,
    component: () => import('./components/Tools/ToolMain'),
  });

  const MarketMain = dynamic({
    app,
    component: () => import('./components/Market/MarketMain'),
  });
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/market" component={MarketMain} />
        <Route exact path="/trade" component={props => requireAuth(TradeSystem, props)} />
        <Route exact path="/tools" component={props => requireAuth(ToolsMain, props)} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
