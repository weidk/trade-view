import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import request from '../../../utils/request';
import styles from './FRprofitBar.css';

class FRprofitBar extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const pms = request('/api/reportfrprofitbyType');
    pms.then((datas) => {
      this.setState({ chartdata: datas.data });
    }).catch(err => ({ err }));
  }
  render() {
    return (
      <div className={styles.normal}>
        <Chart data={this.state.chartdata} forceFit>
          <Legend />
          <Axis name="债券类型" />
          <Axis
            name="盈亏金额" label={{
              formatter: (val) => {
                return `${val}万`;
              },
            }}
          />
          <Tooltip />
          <Geom type="intervalStack" position="债券类型*盈亏金额" color={'盈亏类型'} style={{ stroke: '#fff', lineWidth: 1 }} />
        </Chart>
      </div>
    );
  }
}

export default FRprofitBar;
