import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './IssueDatePicker.css';

const dateFormat = 'YYYY-MM-DD';

const RangePicker = DatePicker.RangePicker;

class IssueDatePicker extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <a>选择发行区间 ：</a>
        <RangePicker
          onChange={this.props.onChange}
          defaultValue={[moment().subtract(10, 'days'),moment()]}
          format={dateFormat}
        />
      </div>
    );
  }
}

export default IssueDatePicker;
