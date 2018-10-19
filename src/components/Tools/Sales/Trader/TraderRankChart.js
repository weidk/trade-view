import React from 'react';
import { Chart, Tooltip, Axis, Geom } from 'bizcharts';
import styles from './TraderRankChart.css';

function TraderRankChart(props) {
  const { barData, title, doubleClickHandle } = props;
  return (
    <div className={styles.normal}>
      <h3>{title}</h3>
      <Chart height={400} data={barData} forceFit onPlotDblClick={ev => doubleClickHandle(ev)}>
        <Axis name="USERNAME" label={{ offset: 12 }} />
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
          color={['AMT', '#C1FFC1-#548B54-#006400']}
        />
      </Chart>
    </div>
  );
}

export default TraderRankChart;
