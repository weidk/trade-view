import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from './SignalChart.css';

function SignalChart(props) {
  const { data } = props;
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'fold',
    fields: ['BUY', 'SELL', 'NONE'],
    // 展开字段集
    key: 'signalkey',
    // key字段
    value: 'signal', // value字段
  });
  const cols = {
    month: {
      range: [0, 1],
    },
  };
  return (
    <div className={styles.normal}>
      <h3> 交易流水 </h3>
      <Chart height={400} data={dv} scale={cols} forceFit padding="auto">
        <Legend />
        <Axis name="date" />
        <Axis name="signalkey" />
        <Tooltip
          crosshairs={{
            type: 'y',
          }}
        />
        <Geom
          type="line"
          position="date*signal"
          size={4}
          color={'signalkey'}
          shape={'smooth'}
        />
      </Chart>
    </div>
  );
}


export default SignalChart;
