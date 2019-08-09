import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
// import styles from './QualificationTs.css';


const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

class QualificationTs extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(90, 'days'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/qualification', {
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
          defaultValue={[moment().subtract(90, 'days'), moment()]}
          format={dateFormat}
        />
        <br />
        <Chart height={400} data={this.state.chartdata} padding="auto" forceFit>
          <Legend />
          <Axis name="td_date" />
          <Axis name="qualification" />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom
            type="line"
            position="td_date*qualification"
            size={3}
            shape={'smooth'}
            color="l (270) 0:rgba(255, 146, 255, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)"
          />
        </Chart>
      </div>
    );
  }
}

export default QualificationTs;
