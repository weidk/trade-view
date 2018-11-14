import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import styles from './RelativeBubbleChart.css';

function RelativeBubbleChart(props) {
  const { data, title, doubleClickHandle } = props;
  return (
    <div className={styles.normal}>
      <h3>{title}</h3>
      <Chart
        height={window.innerHeight} data={data}
        forceFit onPlotDblClick={ev => doubleClickHandle(ev)}
      >
        <Tooltip showTitle={false} />
        <Axis
          name="ORGANIZATIONNAME" label={{ offset: 0 }}
        />
        <Axis name="USERNAME" />
        <Legend />
        <Geom
          type="point" position="USERNAME*ORGANIZATIONNAME" color="USERNAME"
          tooltip="ORGANIZATIONNAME*USERNAME*AMT"
          opacity={0.65} shape="circle" size={['AMT', [1, 120]]}
        />
      </Chart>
    </div>
  );
}

export default RelativeBubbleChart;
