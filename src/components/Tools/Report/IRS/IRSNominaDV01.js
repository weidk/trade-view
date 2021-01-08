import React from 'react';
import fetch from 'dva/fetch';
import { Chart, Tooltip, Axis, Geom, Coord } from 'bizcharts';
import { Divider } from 'antd';
import DataSet from '@antv/data-set';
import styles from './IRSNominaDV01.css';

const _ = require('lodash');

class IRSNominaDV01 extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('/api/getirsdv01')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({ data: jsonData });
        console.warn(jsonData);
      });
  };

  render() {
    const Charts = this.state.data.map((fun) => {
      const funData = _.filter(this.state.data, { 本方交易员: fun.本方交易员 });
      console.warn(fun.本方交易员);
      console.warn(funData);
      const ds = new DataSet();
      const dv = ds.createView().source(funData);
      dv.transform({
        type: 'fold',
        fields: ['DV01_7D', 'DV01_1M', 'DV01_3M', 'DV01_6M', 'DV01_9M', 'DV01_1Y', 'DV01_2Y', 'DV01_3Y', 'DV01_4Y', 'DV01_5Y'],
        // 展开字段集
        key: '期限',
        // key字段
        value: 'dv01', // value字段
      });
      return (
        <div>
          <Divider>{fun.本方交易员} 总DVO1 : {fun.总DV01} 万元</Divider>
          <Chart height="400" weight="300" data={dv} padding="auto" >
            <Coord transpose />
            <Axis name="月份" />
            <Axis
              name="dv01"
              label={{
                formatter: (val) => {
                  return `${val}万`;
                },
              }}
            />
            <Tooltip />
            <Geom
              type="interval"
              position="期限*dv01"
              color={['dv01', (dv01) => {
                if (dv01 > 0) {
                  return '#54ca76';
                } else {
                  return '#EE6363';
                }
              }]}
              adjust={[{
                type: 'dodge',
                marginRatio: 1 / 32,
              }]}
            />
          </Chart>
        </div>
      );
    });
    return (
      <div className={styles.normal}>
        <Divider> 各账户DV01 </Divider>
        {Charts}
      </div>
    );
  }
}

export default IRSNominaDV01;
