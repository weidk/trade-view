import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import { message } from 'antd';


function requireAuth(Layout, props, authType) {
  const storage = window.localStorage;
  let isLogin;
  if (authType === 0) {
    isLogin = storage.getItem('login');
  } else {
    isLogin = storage.getItem('login1');
  }

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

  const Macro = dynamic({
    app,
    component: () => import('./components/Macro/MacroMain'),
  });

  const MarketMain = dynamic({
    app,
    models: () => [
      import('./models/brokerhq'),
    ],
    component: () => import('./components/Market/MarketMain'),
  });

  const Credit = dynamic({
    app,
    component: () => import('./components/Credit/CreditMain'),
  });

  const News = dynamic({
    app,
    component: () => import('./components/News/NewsMain'),
  });

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/market" component={MarketMain} />
        <Route exact path="/trade" component={props => requireAuth(TradeSystem, props, 1)} />
        <Route exact path="/tools" component={props => requireAuth(ToolsMain, props, 0)} />
        <Route exact path="/macro" component={Macro} />
        <Route exact path="/credit" component={Credit} />
        <Route exact path="/news" component={News} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
