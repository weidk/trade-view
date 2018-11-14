import React from 'react';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import china from '../../../../../china.json';
import styles from './ChinaChart.css';

let chinaGeoJSON;
const Chart = createG2((chart) => {
  chart.axis(false);
  chart.polygon().position(Stat.map.region('name', chinaGeoJSON))
    .color('value', '#FFFAFA-#90EE90-#006400')
    .label('name', { label: { fill: '#000', shadowBlur: 5, shadowColor: '#fff' } })
    .style({
      stroke: '#333',
      lineWidth: 1,
    });
  chart.render();
});

function ChinaChart(props) {
  const { data, width, height, title } = props;
  chinaGeoJSON = china;
  return (
    <div className={styles.normal}>
      <h3>{title}</h3>
      <Chart
        data={data}
        width={width}
        height={height}
        forceFit
      />
    </div>
  );
}

export default ChinaChart;
