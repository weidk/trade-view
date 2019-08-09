import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
// import styles from './PureBondIndexMain.css';


const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

class PureBondIndexMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(365, 'days'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/purebondindex', {
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
          defaultValue={[moment().subtract(365, 'days'), moment()]}
          format={dateFormat}
        />
        <br />
        <Chart height={400} data={this.state.chartdata} padding="auto" forceFit>
          <Legend />
          <Axis name="日期" />
          <Axis name="数值" />
          <Tooltip />
          <Geom
            type="line"
            position="日期*数值"
            size={3}
            shape={'smooth'}
            color={'类型'}
          />
        </Chart>
      </div>
    );
  }
}

export default PureBondIndexMain;
