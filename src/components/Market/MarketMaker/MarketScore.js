import React from 'react';
// import styles from './MarketScore.css';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import request from '../../../utils/request';


class MarketScore extends React.Component {
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
    const pms = request('/api/marketscores');
    pms.then((datas) => {
      this.setState({ chartdata: datas.data });
    }).catch(err => ({ err }));
  }

  render() {
    return (
      <Chart height={400} data={this.state.chartdata} forceFit>
        <Legend />
        <Axis name="date" />
        <Axis name="score" />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom type="line" position="date*score" size={2} color={'initiator'} shape={'smooth'} />
      </Chart>
    );
  }
}

export default MarketScore;
