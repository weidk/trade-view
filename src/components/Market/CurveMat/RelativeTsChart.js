import React from 'react';
import { Chart, Geom, Tooltip, Axis, Legend } from 'bizcharts';

class RelativeTsChart extends React.Component {
  render() {
    return (
      <div>
        <Chart height={400} data={this.props.TsChartData} forceFit padding="auto">
          <Axis name="日期" />
          <Axis name="相对价值" />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Legend />
          <Geom
            type="line"
            position="日期*相对价值"
            size={3}
            shape={'smooth'}
          />
        </Chart>
      </div>
    );
  }
}

export default RelativeTsChart;
