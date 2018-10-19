import React from 'react';
import { Chart, Tooltip, Axis, Geom } from 'bizcharts';
import styles from './InstituteRankChart.css';

function InstituteRankChart(props) {
  const { barData, title, doubleClickHandle } = props;
  return (
    <div className={styles.normal}>
      <h3>{title}</h3>
      <Chart height={400} data={barData} forceFit onPlotDblClick={ev => doubleClickHandle(ev)}>
        <Axis
          name="USERNAME" label={{ offset: 12,
            textStyle: {
              rotate: 35 } }}
        />
        <Axis
          name="AMT"
          label={{
            formatter: (val) => {
              return `${val}亿`;
            },
          }}
        />
        <Tooltip />
        <Geom
          type="interval" position="USERNAME*AMT"
          color={['AMT', '#FCD7DE-#F04864']}
        />
      </Chart>
    </div>
  );
}

export default InstituteRankChart;
