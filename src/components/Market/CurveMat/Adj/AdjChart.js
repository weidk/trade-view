import React from 'react';
import moment from 'moment';
import fetch from 'dva/fetch';
import { DatePicker, Spin, Divider } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import styles from './AdjChart.css';

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;
const _ = require('lodash');

class AdjChart extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.onpickerChange([moment().subtract(1, 'years'), moment()]);
  }

  onpickerChange = (values) => {
    try {
      this.setState({ loading: true });
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/adjyieldhistoryapi', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ data: ds, loading: false });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }


  render() {
    const chartData = _.filter(this.state.data, o => this.props.showLines.includes(o.原始资产));
    return (
      <div className={styles.normal}>
        <Divider>
          历史走势
        </Divider>
        <RangePicker
          onChange={this.onpickerChange}
          defaultValue={[moment().subtract(1, 'years'), moment()]}
          format={dateFormat}
        />
        <Spin spinning={this.state.loading} >
          <Chart height={600} forceFit data={chartData}>
            <Tooltip />
            <Axis name="adjYield" />
            <Geom
              type="line"
              position="TradeDate*adjYield"
              color="原始资产"
            />
            <Legend />
          </Chart>
        </Spin>
      </div>
    );
  }
}

export default AdjChart;
