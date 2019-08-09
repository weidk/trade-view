import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
import Abnormal from './Abnormal';
// import styles from './EmotionTs.css';

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

class EmotionTs extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      abnormaldata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(90, 'days'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/emotion', {
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

      fetch('/api/abnormal', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ abnormaldata: ds });
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
        <br />
        <Chart height={400} data={this.state.chartdata} padding="auto" forceFit>
          <Legend />
          <Axis
            name="td_date"
            label={{
              textStyle: {
                fontSize: '18',
              },
              formatter: (val) => {
                return val.substr(5, 5);
              },
            }}
          />
          <Axis
            name="情绪指数"
            label={{
              formatter: (val) => {
                let val1 = val.toString();
                if (val1.length === 1) {
                  val1 += '.0';
                }
                return val1;
              },
              textStyle: {
                fontSize: '18',
              },
            }}
          />
          <Axis
            name="中债收益率曲线_AAA_9M"
            label={{
              formatter: (val) => {
                let val1 = val.toString();
                if (val1.length === 2) {
                  val1 += '.0';
                }
                return val1.substr(1, 3);
              },
              textStyle: {
                fontSize: '18',
              },
            }}
          />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom
            type="line"
            position="td_date*情绪指数"
            size={3}
            shape={'smooth'}
            color="#53ab53"
          />
          <Geom
            type="line"
            position="td_date*中债收益率曲线_AAA_9M"
            size={3}
            shape={'smooth'}
            color="#ec6663"
            style={{
              lineDash: [4, 4],
            }}
            tooltip={['td_date*中债收益率曲线_AAA_9M', (date, 中债收益率曲线_AAA_9M) => {
              return {
                // 自定义 tooltip 上显示的 title 显示内容等。
                name: '中债收益率曲线_AAA_9M',
                title: date,
                value: 中债收益率曲线_AAA_9M * -1,
              };
            }]}
          />
        </Chart>
        <br />
        <Abnormal data={this.state.abnormaldata} />
      </div>
    );
  }
}

export default EmotionTs;
