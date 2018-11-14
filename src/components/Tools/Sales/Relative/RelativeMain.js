import React from 'react';
import moment from 'moment';
import fetch from 'dva/fetch';
import styles from './RelativeMain.css';
import MyDatePicker from '../MyDatePicker';
import RelativeBubbleChart from './RelativeBubbleChart';

const defaultRange = [moment('1..1', 'DDD DDDD'), moment()];

class RelativeMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }
  componentDidMount() {
    this.pickerChange(defaultRange);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      this.setState({ start: startDay,
        end: endDay,
      });
      fetch('/api/traderandins', {
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
      <div className={styles.normal}>
        <MyDatePicker title="选择区间：" termRange={defaultRange} onChangeHandle={this.pickerChange} />
        <RelativeBubbleChart title="机构获配量与交易员粘性" data={this.state.chartdata} />
      </div>
    );
  }
}

export default RelativeMain;
