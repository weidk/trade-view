import React from 'react';
import { Spin } from 'antd';
import styles from './O32Main.css';
import FutureDeposit from './FutureDeposit';
import NetCashFlow from './NetCashFlow';

const Stomp = require('stompjs');
const _ = require('lodash');

class O32Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      O32Json: [],
      sumData: [],
      netCash: [],
      loading: true,
    };
  }
  componentDidMount() {
    // eslint-disable-next-line no-undef
    const ws = new WebSocket(global.constants.rabbimqws);
    const client = Stomp.over(ws);
    client.heartbeat.incoming = 0;
    client.connect('bond', 'bond', () => {
      client.subscribe('/exchange/O32Info/', (ds) => {
        // const O32Json = JSON.parse(ds.body);
        const O32Json = _.filter(JSON.parse(ds.body), o => o.totaldeposit > 10000);
        const netCash = _.filter(JSON.parse(ds.body), o => o.netcashsh !== 0 || o.netcashsz !== 0);
        const sumoccupy = _.sumBy(O32Json, 'occupydeposit');
        const sumenable = _.sumBy(O32Json, 'enabledeposit');
        const totaldeposit = sumenable + sumoccupy;
        const sumData = [{ assetname: '汇总', occupydeposit: sumoccupy, enabledeposit: sumenable, totaldeposit, occupyrate: sumoccupy / totaldeposit }];
        this.setState({ O32Json, sumData, netCash, loading: false });
      }, { 'auto-delete': true });
    }, (evt) => {
      console.log(`error: ${evt}`);
    }, '/');
  }
  render() {
    return (
      <div className={styles.normal}>
        <Spin spinning={this.state.loading}>
          <FutureDeposit O32Json={this.state.O32Json} sumData={this.state.sumData} />
          <NetCashFlow O32Json={this.state.netCash} />
        </Spin>
      </div>
    );
  }
}

export default O32Main;
