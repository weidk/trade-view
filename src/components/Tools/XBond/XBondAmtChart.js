import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import styles from './XBondAmtChart.css';

function XBondAmtChart(props) {
  const { data } = props;
  return (
    <div className={styles.normal}>
      <h3> 单日做市量 </h3>
      <Chart weight={window.innerWidth * (1 / 2)} data={data} padding="auto" forceFit>
        <Tooltip crosshairs />
        <Axis
          name="AMT"
          label={{
            formatter: val => `${val} 亿`,
          }}
        />
        <Legend />
        <Geom type="line" position="TRADEDATE*AMT" color="SELFTRADERNAME" shape={'smooth'} />
        <Geom type="point" position="TRADEDATE*AMT" color="SELFTRADERNAME" shape={'circle'} size={4} />
      </Chart>
      <h3> 累计做市量 </h3>
      <Chart weight={window.innerWidth * (1 / 2)} data={data} padding="auto" forceFit>
        <Tooltip crosshairs />
        <Axis
          name="CUMSUMAMT"
          label={{
            formatter: val => `${val} 亿`,
          }}
        />
        <Legend />
        <Geom type="line" position="TRADEDATE*CUMSUMAMT" color="SELFTRADERNAME" shape={'smooth'} size={2} />
        <Geom type="area" position="TRADEDATE*CUMSUMAMT" color="SELFTRADERNAME" shape={'smooth'} />
      </Chart>
    </div>
  );
}

export default XBondAmtChart;
