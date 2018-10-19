import React from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
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
          <Geom type="area" position="date*amt" color="#2E8B57" shape={'smooth'} />
          <Geom type="line" position="date*amt" size={1} color="#2E8B57" shape={'smooth'} />
        </Chart>
      </div>
    );
  }
}

export default BondLendArea;
