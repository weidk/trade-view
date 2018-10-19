import React from 'react';
import { Divider } from 'antd';
import request from '../../../../utils/request';
import styles from './Allocate.css';
import AllocateChart from './AllocateChart';

class Allocate extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      interestdata: [],
      creditdata: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const pms = request('/api/saleallocateamt');
    pms.then((datas) => {
      this.setState({ chartdata: datas.data });
    }).catch(err => ({ err }));

    const pms1 = request('/api/saleallocateamtinterest');
    pms1.then((datas) => {
      this.setState({ interestdata: datas.data });
    }).catch(err => ({ err }));

    const pms2 = request('/api/saleallocateamtcredit');
    pms2.then((datas) => {
      this.setState({ creditdata: datas.data });
    }).catch(err => ({ err }));
  }

  render() {
    return (
      <div className={styles.normal}>
        <AllocateChart data={this.state.chartdata} title="获配额走势--全品种" />
        <Divider />
        <AllocateChart data={this.state.interestdata} title="获配额走势--利率" />
        <Divider />
        <AllocateChart data={this.state.creditdata} title="获配额走势--信用" />
      </div>
    );
  }
}

export default Allocate;
