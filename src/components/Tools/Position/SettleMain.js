import React from 'react';
import fetch from 'dva/fetch';
import SettleDetail from './SettleDetail';
import SettleSum from './SettleSum';
import BondLendPositions from './BondLendPositions';
import UnSubTraders from './UnSubTraders';
import request from '../../../utils/request';
import styles from './SettleMain.css';

class SettleMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settleAmt: 0,
      netbond: [],
      nonbond: [],
    };
  }

  fetchData = () => {
    const pms = request('/api/totalsettle');
    pms.then((ds) => {
      const amt = ds.data;
      this.setState({ settleAmt: amt });
    }).catch(err => ({ err }));

    try {
      fetch('/api/netsellbond', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ netbond: ds });
        });
      });
    } catch (error) {
      console.log(error);
    }

    try {
      fetch('/api/nonbondinfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ nonbond: ds });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <UnSubTraders />
        <BondLendPositions />
        <SettleSum settleAmt={this.state.settleAmt} netbond={this.state.netbond} nonbond={this.state.nonbond} fetchData={this.fetchData} />
        <SettleDetail fetchSumData={this.fetchData} />
      </div>
    );
  }
}

export default SettleMain;
