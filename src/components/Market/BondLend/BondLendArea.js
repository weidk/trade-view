import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import styles from './BondLendArea.css';

class BondLendArea extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <Chart data={this.props.chartdata} forceFit>
          <Axis name="date" />
          <Axis
            name="amt" label={{
              formatter: (val) => {
                return `${val}亿`;
              },
            }}
          />
          <Tooltip crosshairs={{ type: 'line' }} />
          <Legend />
          <Geom type="area" position="date*amt" color="code" shape={'smooth'} />
          <Geom type="line" position="date*amt" color="code" shape={'smooth'} size={3} />
        </Chart>
      </div>
    );
  }
}

export default BondLendArea;
