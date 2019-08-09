import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, View, Coord } from 'bizcharts';
import { Select, Row, Col, DatePicker, Spin, Icon } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
import DataSet from '@antv/data-set';
import styles from './AbsoluteCurve.css';

const R = require('ramda');

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;
let selectedtags1 = [];
let selectedtags2 = [];
class AbsoluteCurve extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      selectoptions: [],
      selectdata: [],
      chartGap: [],
      filteredChartGap: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(1, 'years'), moment()]);
  }

  pickerChange = (values) => {
    try {
      this.setState({ loading: true });
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/absolutecurve', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds, selectoptions: R.uniq(R.pluck('类型')(ds)), loading: false });
          this.handleChange(selectedtags1);
          this.handleChange2(selectedtags2);
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange=(value) => {
    selectedtags1 = value;
    const showData = [];
    const filterData = (x) => {
      if (R.contains(x.类型)(selectedtags1)
        || R.contains(x.类型)(selectedtags2)) {
        showData.push(x);
      }
    };
    R.forEach(filterData)(this.state.chartdata);
    this.setState({ selectdata: showData }, () => this.calGap());
  }

  handleChange2=(value) => {
    selectedtags2 = value;
    const showData = [];
    const filterData = (x) => {
      if (R.contains(x.类型)(selectedtags1)
        || R.contains(x.类型)(selectedtags2)) {
        showData.push(x);
      }
    };
    R.forEach(filterData)(this.state.chartdata);
    this.setState({ selectdata: showData }, () => this.calGap());
  }

  calGap = () => {
    const gap = [];
    const calGaplocal = (x) => {
      if (x.类型 === selectedtags1[0]) {
        const isDate = R.propEq('日期', x.日期);
        const isType = R.propEq('类型', selectedtags2[0]);
        const isSecond = R.allPass([isDate, isType]);
        const Second = R.find(isSecond)(this.state.selectdata);
        if (typeof (Second) !== 'undefined') {
          if (x.收益率 !== null && Second.收益率 !== null) {
            const jicha = Math.round((x.收益率 - Second.收益率) * 100) / 100;
            gap.push({ 日期: x.日期, 基差: jicha });
          } else {
            gap.push({ 日期: x.日期, 基差: null });
          }
        }
      }
    };
    R.forEach(calGaplocal)(this.state.selectdata);
    const notNaN = x => !R.isNil(x.基差);
    const filteredChartGap = R.filter(notNaN)(gap);
    this.setState({ chartGap: gap, filteredChartGap });
  }

  render() {
    const children = [];
    const pushChild = x => children.push(<Option key={x}>{x}</Option>);
    R.forEach(pushChild)(this.state.selectoptions);

    const ds = new DataSet();
    const dv = ds.createView().source(this.state.filteredChartGap);
    dv.transform({
      type: 'bin.histogram',
      field: '基差',
      binWidth: 0.02,
      as: ['value', 'count'],
    });

    const lastValue = this.state.chartGap[this.state.chartGap.length - 1];
    const FindLast = x => x.value[0] <= lastValue.基差 & x.value[1] >= lastValue.基差;
    const lastData = R.find(FindLast)(dv.rows);

    let dv1 = '';
    try {
      const ds1 = new DataSet();
      dv1 = ds1.createView().source(this.state.filteredChartGap);
      dv1.transform({
        type: 'kernel-smooth.regression',
        method: 'gaussian',
        field: '基差',
      });
    } catch (err) {
      console.log(err);
    }


    return (
      <div className={styles.normal}>
        <Spin spinning={this.state.loading} >
          <Row>
            <Col span={8} >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择第一条收益率曲线曲线"
                onChange={this.handleChange}
              >
                {children}
              </Select>
            </Col>
            <Col span={1} >
              <div className={styles.mid}>
                <Icon type="minus" />
              </div>
            </Col>
            <Col span={8} >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择第二条收益率曲线曲线"
                onChange={this.handleChange2}
              >
                {children}
              </Select>
            </Col>
            <Col span={7}>
              <RangePicker
                onChange={this.pickerChange}
                defaultValue={[moment().subtract(1, 'years'), moment()]}
                format={dateFormat}
              />
            </Col>
          </Row>
          <Row>
            <Col span={18} >
              <Chart
                height={window.innerHeight - 180} forceFit padding="77"
              >
                <Legend allowAllCanceled />
                <Tooltip crosshairs={{ type: 'y' }} />
                <View data={this.state.chartGap} >
                  <Axis name="基差" position="right" />
                  <Geom
                    type="area"
                    position="日期*基差"
                    color="#BEBEBE"
                    shape={'smooth'}
                  />
                </View>
                <View data={this.state.selectdata} >
                  <Axis name="日期" />
                  <Axis name="收益率" />
                  <Geom type="line" position="日期*收益率" size={2} color={'类型'} shape={'smooth'} />
                </View>
              </Chart>
            </Col>
            <Col span={6} >
              <Chart height={window.innerHeight - 180} forceFit>
                <Coord transpose />
                <Tooltip />
                <View data={dv}>
                  <Axis name="value" />
                  <Axis name="count" />
                  <Geom
                    type="interval" position="value*count"
                    color={['value', (value) => {
                      if (typeof (lastData) !== 'undefined') {
                        if (lastData.value !== value) { return '#BEBEBE'; } else { return '#ec6663'; }
                      }
                    }]}
                    tooltip={['value*count', (value) => {
                      return {
                        name: '基差：',
                        title: `分位数：${Math.round(10000 * ((R.filter(x => x.基差 <= value[0])(this.state.filteredChartGap)).length
                        / this.state.filteredChartGap.length)) / 100}%`,
                        value: value[1],
                      };
                    }]}
                  />
                </View>
                <View data={dv1}>
                  <Geom
                    type="line"
                    position="x*y"
                    color="#BEBEBE"
                    tooltip={{ triggerOn: 'none' }}
                  />
                </View>
              </Chart>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}

export default AbsoluteCurve;
