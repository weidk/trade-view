import React from 'react';
import { Chart, Geom, Tooltip, Coord, Axis } from 'bizcharts';
import styles from './DealBarNew.css';


class DealBarCompare extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      x: '',
    };
  }

  render() {
    const scale = {
      Amt: {
        tickCount: 3,
      },
    };
    return (
      <div className={styles.normal}>
        <h3>{this.props.title}</h3>
        <Chart height="500" data={this.props.data} forceFit padding="auto" scale={scale} >
          <Coord transpose />
          <Axis name="InsType" label={{ offset: 12 }} />
          <Axis name="Amt" />
          <Tooltip />
          <Geom type="intervalStack" position="InsType*Amt" color={'NewOld'} />
        </Chart>
      </div>
    );
  }
}

export default DealBarCompare;
