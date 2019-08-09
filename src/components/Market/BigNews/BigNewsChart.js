import React from 'react';
import { Chart, Tooltip, Axis, Line, Guide } from 'viser-react';
import styles from './BigNewsChart.css';


function BigNewsChart(props) {
  const guides = [];
  const { data } = props;
  let dirc = 'upward';
  data.forEach((item) => {
    if (item.NEWS !== null) {
      guides.push({
        type: 'dataMarker',
        position: [item.DATE, item.CNYIELD],
        content: item.NEWS,
        lineLength: 50,
        style: {
          text: {
            textAlign: 'left',
          },
        },
        direction: dirc,
      });
      if (dirc === 'upward') {
        dirc = 'downward';
      } else {
        dirc = 'upward';
      }
    }
  });
  return (
    <div className={styles.normal}>
      <Chart forceFit height={600} data={data} padding={[50]}>
        <Tooltip />
        <Axis />
        <Line position="DATE*CNYIELD" />
        {guides.map((opts, i) => {
          return <Guide key={i} {...opts} />;
        })}
      </Chart>
    </div>
  );
}

export default BigNewsChart;
