import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './HidenDatePicker.css';

const RangePicker = DatePicker.RangePicker;

class HidenDatePicker extends React.Component {
  disabledDate = (current) => {
    return current >= moment().startOf('day') || current < moment('2018-01-01');
  }

  render() {
    return (
      <div className={styles.normal}>
        <a>选择查询隐含评级变动区间 ：</a>
        <RangePicker
          disabledDate={current => this.disabledDate(current)}
          onChange={this.props.onChange}
          defaultValue={[moment().subtract(2, 'days'), moment().subtract(1, 'days')]}
          format="YYYY-MM-DD"
        />
      </div>
    );
  }
}

export default HidenDatePicker;
