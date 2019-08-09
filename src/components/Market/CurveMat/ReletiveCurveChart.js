import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { Divider } from 'antd';
import styles from './ReletiveCurveChart.css';

function ReletiveCurveChart(props) {
  const { data, title } = props;
  return (
    <div className={styles.normal}>
      <h3> {title} </h3>
      <Chart
        height={window.innerHeight - 200} data={data} forceFit
        padding="77"
      >
        <Legend />
        <Axis name="日期" />
        <Axis name="相对价值" />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom type="line" position="日期*相对价值" size={2} color={'类型'} shape={'smooth'} />
      </Chart>
      <Divider />
    </div>
  );
}

export default ReletiveCurveChart;
