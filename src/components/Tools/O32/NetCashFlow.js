import React from 'react';
import { Divider } from 'antd';
import { Chart, Geom, Axis, Tooltip, Label } from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from './NetCashFlow.css';

class NetCashFlow extends React.Component {
  render() {
    const ds = new DataSet();
    const dv = ds.createView().source(this.props.O32Json);
    dv.transform({
      type: 'fold',
      fields: ['netcashsh', 'netcashsz'],
      // 展开字段集
      key: 'type',
      // key字段
      value: 'value', // value字段
    });
    return (
      <div className={styles.normal}>
        <Divider> 交易所当日资金净流入 </Divider>
        <Chart
          height={400}
          data={dv}
          forceFit
          padding="100"
        >
          {/* <Legend clickable={false} />*/}
          <Axis
            name="value"
            label={{
              formatter: (val) => {
                return `${val}万`;
              },
            }}
          />
          <Axis name="assetname" />
          <Tooltip />
          <Geom
            type="interval"
            position="assetname*value"
            color={[['type', 'value'], (type, value) => {
              if (type === 'netcashsh') {
                if (value > 0) {
                  return '#2b6cbb';
                } else {
                  return '#EE6363';
                }
              }
              if (type === 'netcashsz') {
                if (value > 0) {
                  return '#54ca76';
                } else {
                  return '#EE6363';
                }
              }
            }]}
            adjust={[{
              type: 'dodge',
              marginRatio: 1 / 32,
            }]}
          >
            <Label
              content={[
                'value',
                (value) => {
                  // 用于格式化 最终显示的 label
                  return value;
                }]}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default NetCashFlow;
