import React from 'react';
import request from '../../../utils/request';
import CurveMatChart from './CurveMatChart';
import styles from './CurveMatMain.css';

class CurveMatMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    const pms = request('/api/curvemat');
    pms.then((datas) => {
      const ds = datas.data;
      this.setState({
        chartdata: ds,
      });
    }).catch(err => ({ err }));
  }

  render() {
    return (
      <div className={styles.normal}>
        <CurveMatChart rawData={this.state.chartdata} />
      </div>
    );
  }
}

export default CurveMatMain;
