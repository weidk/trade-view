import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker, Divider } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
import styles from './FuturePosition.css';


const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;
const R = require('ramda');

class FuturePosition extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdataT: [],
      chartdataTF: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(60, 'days'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/futurepositionchange', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const Tds = R.filter(R.propEq('productid', 'T'))(ds);
          const TFds = R.filter(R.propEq('productid', 'TF'))(ds);
          this.setState({ chartdataT: Tds, chartdataTF: TFds });
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
          defaultValue={[moment().subtract(60, 'days'), moment()]}
          format={dateFormat}
        />
        <h3 className={styles.normal}>T</h3>
        <Chart height={400} data={this.state.chartdataT} forceFit>
          <Legend />
          <Axis name="tradingday" />
          <Axis name="varposition" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="tradingday*varposition"
            color={['datatypeid', (cut) => {
              if (cut === '空') { return '#53ab53'; } else { return '#ec6663'; }
            }]}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
        <Divider />
        <h3 className={styles.normal}>TF</h3>
        <Chart height={400} data={this.state.chartdataTF} forceFit>
          <Legend />
          <Axis name="tradingday" />
          <Axis name="varposition" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="tradingday*varposition"
            color={['datatypeid', (cut) => {
              if (cut === '空') { return '#53ab53'; } else { return '#ec6663'; }
            }]}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default FuturePosition;
