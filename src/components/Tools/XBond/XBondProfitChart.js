import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import styles from './XBondProfitChart.css';

function XBondProfitChart(props) {
  const { data } = props;
  return (
    <div className={styles.normal}>
      <h3> 单日盈亏 </h3>
      <Chart weight={window.innerWidth * (1 / 2)} data={data} padding="auto" forceFit>
        <Tooltip crosshairs />
        <Axis
          name="PROFIT"
          label={{
            formatter: val => `${val} 万`,
          }}
        />
        <Legend />
        <Geom type="line" position="TRADEDATE*PROFIT" color="SELFTRADERNAME" shape={'smooth'} />
        <Geom type="point" position="TRADEDATE*PROFIT" color="SELFTRADERNAME" shape={'circle'} size={4} />
      </Chart>
      <h3> 累计盈亏 </h3>
      <Chart weight={window.innerWidth * (1 / 2)} data={data} padding="auto" forceFit>
        <Tooltip crosshairs />
        <Axis
          name="CUMSUMPROFIT"
          label={{
            formatter: val => `${val} 万`,
          }}
        />
        <Legend />
        <Geom type="line" position="TRADEDATE*CUMSUMPROFIT" color="SELFTRADERNAME" shape={'smooth'} size={2} />
        <Geom type="area" position="TRADEDATE*CUMSUMPROFIT" color="SELFTRADERNAME" shape={'smooth'} />
      </Chart>
    </div>
  );
}

export default XBondProfitChart;
