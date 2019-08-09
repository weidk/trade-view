import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, View, Coord } from 'bizcharts';
import { Select, Row, Col } from 'antd';
import DataSet from '@antv/data-set';
import styles from './ReletiveChartAll.css';

const { Option } = Select;
const R = require('ramda');

class ReletiveChartAll extends React.Component {
  render() {
    const children = [];
    const pushChild = x => children.push(<Option key={x}>{x}</Option>);
    R.forEach(pushChild)(this.props.options);

    const ds = new DataSet();
    const dv = ds.createView().source(this.props.chartGap);
    dv.transform({
      type: 'bin.histogram',
      field: '基差',
      binWidth: 0.02,
      as: ['value', 'count'],
    });

    const lastValue = this.props.chartGap[this.props.chartGap.length - 1];
    const FindLast = x => x.value[0] <= lastValue.基差 & x.value[1] >= lastValue.基差;
    const lastData = R.find(FindLast)(dv.rows);

    return (
      <div className={styles.normal}>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择相对价值曲线"
          onChange={this.props.onChange}
        >
          {children}
        </Select>
        <Row>
          <Col span={18} >
            <Chart
              height={window.innerHeight - 180} forceFit padding="77"
            >
              <Legend allowAllCanceled />
              <Tooltip crosshairs={{ type: 'y' }} />
              <View data={this.props.chartGap} >
                <Axis name="基差" position="right" />
                <Geom
                  type="area"
                  position="日期*基差"
                  color="#BEBEBE"
                  shape={'smooth'}
                />
              </View>
              <View data={this.props.selectdata} >
                <Axis name="日期" />
                <Axis name="相对价值" />
                <Geom type="line" position="日期*相对价值" size={2} color={'类型'} shape={'smooth'} />
              </View>
            </Chart>
          </Col>
          <Col span={6} >
            <Chart height={window.innerHeight - 180} data={dv} forceFit>
              <Coord transpose />
              <Tooltip />
              <Axis
                name="value"
                label={{
                  formatter: (val) => {
                    if (val % 2) {
                      return val;
                    }

                    return '';
                  },
                }}
              />
              <Axis name="count" />
              <Geom
                type="interval" position="value*count"
                color={['value', (value) => {
                  if (typeof (lastData) !== 'undefined') {
                    if (lastData.value === value) { return '#ec6663'; } else { return '#BEBEBE'; }
                  }
                }]}
                tooltip={['value*count', (value) => {
                  return {
                    name: '相对差：',
                    title: `分位数：${Math.round(10000 * ((R.filter(x => x.基差 <= value[0])(this.props.chartGap)).length
                        / this.props.chartGap.length)) / 100}%`,
                    value: value[1],
                  };
                }]}
              />
            </Chart>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ReletiveChartAll;
