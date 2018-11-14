import React from 'react';
import { Tabs, Icon } from 'antd';
import styles from './Orders.css';
import OrderIng from './OrderIng';
import OrderOver from './OrderOver';

const R = require('ramda');

const TabPane = Tabs.TabPane;

function Orders(props) {
  const { data, onCancle } = props;
  const IngData = R.filter(d => d.status === '买卖')(data);
  const OverData = R.reject(d => d.status === '买卖')(data);
  return (
    <div className={styles.normal}>
      <Tabs tabPosition="left">
        <TabPane tab={<Icon type="plus" />} key="1" ><OrderIng data={IngData} onCancle={onCancle} /></TabPane>
        <TabPane tab={<Icon type="check" />} key="2"><OrderOver data={OverData} /></TabPane>
      </Tabs>
    </div>
  );
}

export default Orders;
