import React from 'react';
// import styles from './IssueChart.css';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';


class IssueChart extends React.Component {
  render() {
    return (<Chart data={this.props.data} forceFit padding="auto">
      <Axis name="term" title />
      <Axis name="yield" title />
      <Legend />
      <Tooltip crosshairs={{ type: 'line' }} />
      <Geom
        type="area" position="term*yield" color={['rank', (rank) => {
          if (rank === 'AAA') { return '#0c3e7d'; } else if (rank === 'AA+') { return '#eb0e05'; } else if (rank === 'AA') { return '#ff7300'; } else { return '#757575'; }
        }]}
      />
      <Geom
        type="line" position="term*yield" size={1} color={['rank', (rank) => {
          if (rank === 'AAA') { return '#0c3e7d'; } else if (rank === 'AA+') { return '#eb0e05'; } else if (rank === 'AA') { return '#ff7300'; } else { return '#757575'; }
        }]}
      />
      <Geom
        type="point" position="term*yield" size={4} shape="circle"
        color={['rank', (rank) => {
          if (rank === 'AAA') { return '#0c3e7d'; } else if (rank === 'AA+') { return '#eb0e05'; } else if (rank === 'AA') { return '#ff7300'; } else { return '#757575'; }
        }]}
        style={{ stroke: '#fff', lineWidth: 1, fillOpacity: 1 }}
      />
    </Chart>);
  }
}

export default IssueChart;
