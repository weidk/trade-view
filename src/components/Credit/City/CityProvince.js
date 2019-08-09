import React from 'react';
import fetch from 'dva/fetch';
import moment from 'moment';
import { DatePicker } from 'antd';
import china from '../../../../china.json';
import ChinaChart from '../../Tools/Sales/Bank/ChinaChart';
import styles from './CityProvince.css';

const RangePicker = DatePicker.RangePicker;
const R = require('ramda');

class CityProvince extends React.Component {
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
      fetch('/api/cityprovince', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const userData = [];
          const features = china.features;
          for (let i = 0; i < features.length; i += 1) {
            const name = features[i].properties.name;
            const info = R.find(R.propEq('name', name))(ds);
            if (typeof (info) !== 'undefined') {
              userData.push({
                name,
                value: info.value,
              });
            } else {
              userData.push({
                name,
                value: 0,
              });
            }
          }
          this.setState({ chartdata: userData });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <RangePicker
          onChange={this.pickerChange}
          defaultValue={[moment().subtract(10, 'days'), moment()]}
          format="YYYY-MM-DD"
        />
        <ChinaChart
          data={this.state.chartdata}
          width={300}
          height={500}
          title=""
        />
      </div>
    );
  }
}

export default CityProvince;
