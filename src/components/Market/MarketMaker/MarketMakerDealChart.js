import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
// import styles from './MarketMakerDealChart.css';

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;
// Date.prototype.format = function (fmt) {
//   const o = {
//     'M+': this.getMonth() + 1, // 月份
//     'd+': this.getDate(), // 日
//     'h+': this.getHours(), // 小时
//     'm+': this.getMinutes(), // 分
//     's+': this.getSeconds(), // 秒
//     'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
//     S: this.getMilliseconds(), // 毫秒
//   };
//   if (/(y+)/.test(fmt)) {
//     fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
//   }
//   for (const k in o) {
//     if (new RegExp(`(${k})`).test(fmt)) {
//       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
// ((`00${o[k]}`).substr((`${o[k]}`).length)));
//     }
//   }
//   return fmt;
// };

class MarketMakerDealChart extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(10, 'days'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/marketmakerdeal', {
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
          defaultValue={[moment().subtract(10, 'days'), moment()]}
          format={dateFormat}
        />
        <br />
        <Chart data={this.state.chartdata} forceFit>
          <Legend />
          <Axis name="TRADEMETHOD" />
          <Axis
            name="AMT" label={{
              formatter: (val) => {
                return `${val}亿`;
              },
            }}
          />
          <Tooltip />
          <Geom type="intervalStack" position="TRADEMETHOD*AMT" color={'DEPARTMENT'} style={{ stroke: '#fff', lineWidth: 1 }} />
        </Chart>
      </div>
    );
  }
}


export default MarketMakerDealChart;
