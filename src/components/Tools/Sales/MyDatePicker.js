import React from 'react';
import { DatePicker } from 'antd';
import styles from './MyDatePicker.css';

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

function MyDatePicker(props) {
  const { title, onChangeHandle, termRange } = props;
  return (
    <div className={styles.normal}>
      <div className={styles.normal}>
        <a>{title}</a>
        <RangePicker
          onChange={onChangeHandle}
          defaultValue={termRange}
          format={dateFormat}
        />
      </div>
    </div>
  );
}

export default MyDatePicker;
