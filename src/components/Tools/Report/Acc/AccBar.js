import React from 'react';
import { Chart, Tooltip, Axis, Geom } from 'bizcharts';
import styles from './AccBar.css';

function AccBar(props) {
  const { barData, ax1, ax2, title, format } = props;
  return (
    <div className={styles.normal}>
      <h3>{title}</h3>
      <Chart height={266} data={barData} forceFit>
        <Axis name={ax1} />
        <Axis
          name={ax2}
          label={{
            formatter: (val) => {
              return `${val}${format}`;
            },
          }}
        />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom
          type="interval"
          position={`${ax1}*${ax2}`}
          color={[ax2, (cut) => {
            if (cut < 0) { return '#53ab53'; } else { return '#ec6663'; }
          }]}
        />
      </Chart>
    </div>
  );
}

export default AccBar;
