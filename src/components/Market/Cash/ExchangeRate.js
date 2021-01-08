import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

class ExchangeRate extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(1, 'years'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/exchangerate', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }


  render() {
    return (
      <div>
        <a>选择查询区间 ：</a>
        <RangePicker
          onChange={this.pickerChange}
          defaultValue={[moment().subtract(1, 'years'), moment()]}
          format={dateFormat}
        />
        <Chart height={600} data={this.state.chartdata} forceFit>
          <Legend />
          <Axis name="date" />
          <Axis name="rate" />
          <Tooltip />
          <Geom
            type="line"
            position="date*rate"
            color="type"
            shape={'smooth'}
          />
        </Chart>
      </div>
    );
  }
}

export default ExchangeRate;
