import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from './ComsumReturnAreaChart.css';

function ComsumReturnAreaChart(props) {
  const { data } = props;
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'fold',
    fields: ['comsumreturn', 'beta'],
    // 展开字段集
    key: 'signal',
    // key字段
    value: 'price', // value字段
  });
  const cols = {
    month: {
      range: [0, 1],
    },
  };
  return (
    <div className={styles.normal}>
      <h3> 累计收益 </h3>
      <Chart height={400} data={dv} scale={cols} forceFit padding="auto">
        <Legend />
        <Axis name="date" />
        <Axis
          name="price"
          label={{
            formatter: val => `${val}%`,
          }}
        />
        <Tooltip
          crosshairs={{
            type: 'y',
          }}
        />
        <Geom
          type="area"
          position="date*price"
          size={2}
          color={'signal'}
          shape={'smooth'}
        />
      </Chart>
    </div>
  );
}

export default ComsumReturnAreaChart;
