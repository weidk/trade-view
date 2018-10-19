import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './DealDatePicker.css';


const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

class DealDatePicker extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <a>选择查询区间 ：</a>
        <RangePicker
          onChange={this.props.onChange}
          defaultValue={[moment().subtract(10, 'days'), moment()]}
          format={dateFormat}
        />
      </div>
    );
  }
}

export default DealDatePicker;
