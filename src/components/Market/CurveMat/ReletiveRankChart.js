import React from 'react';
import { Chart, Geom, Tooltip, Axis, Coord } from 'bizcharts';
import { Switch } from 'antd';
import styles from './ReletiveRankChart.css';

class ReletiveRankChart extends React.Component {
  constructor() {
    super();
    this.state = {
      vertical: true,
      rotate: 0,
    };
  }
  onSwitchHandle = (e) => {
    if (e) {
      this.setState({ vertical: true, rotate: 0 });
    } else {
      this.setState({ vertical: false, rotate: 30 });
    }
  }
  render() {
    let coord = null;
    if (this.state.vertical) {
      coord = <Coord transpose />;
    } else {
      coord = <Coord />;
    }
    return (
      <div className={styles.normal}>
        <Switch checkedChildren="竖" unCheckedChildren="横" defaultChecked onChange={this.onSwitchHandle} />
        <Chart data={this.props.data} forceFit padding="auto" height={window.innerHeight - 200}>
          <Axis name="类型" label={{ offset: 12, rotate: this.state.rotate }} />
          <Axis name="相对价值" />
          {coord}
          <Tooltip />
          <Geom
            type="interval"
            position="类型*相对价值"
            color={['类型', '#53ab53-#ec6663']}
          />
        </Chart>

      </div>
    );
  }
}

export default ReletiveRankChart;
