import React from 'react';
import { Affix, Tabs, Button, DatePicker, Spin } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
import ReletiveCurveChart from './ReletiveCurveChart';
import ReletiveRankChart from './ReletiveRankChart';
import ReletiveChartAll from './ReletiveChartAll';
// import styles from './ReletiveCurve.css';

const TabPane = Tabs.TabPane;
const ExportJsonExcel = require('js-export-excel');
const R = require('ramda');

class ReletiveCurve extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      labels: [],
      selectdata: [],
      chartGap: [],
      loading: false,
      tags: [],
    };
  }

  componentDidMount() {
    this.pickerChange(moment().subtract(1, 'years'));
  }

  pickerChange = (values) => {
    try {
      this.setState({ loading: true });
      fetch('/api/reletivecurve', {
        method: 'POST',
        body: JSON.stringify({ start: values.format('YYYY-MM-DD') }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds, labels: R.uniq(R.pluck('类型')(ds.all)), loading: false });
          this.handleChange(this.state.tags);
        });
      });
    } catch (error) {
      console.log('error: ', error);
    }
  }


  writeToExcel = (data) => {
    const option = {};
    option.fileName = '相对价值数据';
    const sheetHeaderName = Object.keys(data.国债[0]);
    option.datas = [
      {
        sheetData: data.国债,
        sheetName: '国债',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.国开,
        sheetName: '国开',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.进出口,
        sheetName: '进出口',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.农发,
        sheetName: '农发',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.地方政府债,
        sheetName: '地方政府债',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.利率互换,
        sheetName: '利率互换',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.中票短融AAA,
        sheetName: '中票短融AAA',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.中票短融AAplus,
        sheetName: '中票短融AA+',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.中票短融AA,
        sheetName: '中票短融AA',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.中票短融1年,
        sheetName: '中票短融1年',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.中票短融3年,
        sheetName: '中票短融3年',
        sheetHeader: sheetHeaderName,
      },
      {
        sheetData: data.中票短融5年,
        sheetName: '中票短融5年',
        sheetHeader: sheetHeaderName,
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  handleChange=(value) => {
    this.setState({ tags: value });
    const showData = [];
    const filterData = (x) => {
      if (R.contains(x.类型)(value)) {
        showData.push(x);
      }
    };
    R.forEach(filterData)(this.state.chartdata.all);
    this.setState({ selectdata: showData });

    const gap = [];
    const calGap = (x) => {
      if (x.类型 === value[0]) {
        const isDate = R.propEq('日期', x.日期);
        const isType = R.propEq('类型', value[1]);
        const isSecond = R.allPass([isDate, isType]);
        const Second = R.find(isSecond)(showData);
        const jicha = Math.round((x.相对价值 - Second.相对价值) * 100) / 100;
        gap.push({ 日期: x.日期, 基差: jicha });
      }
    };
    R.forEach(calGap)(showData);

    this.setState({ chartGap: gap });
  }

  render() {
    const operations =
      (<Affix offsetTop={this.state.top}>
        <DatePicker onChange={this.pickerChange} defaultValue={moment().subtract(1, 'years')} />
        <Button type="primary" onClick={() => window.scrollTo(0, 0)}>回到顶部</Button>
        <Button type="primary" onClick={() => this.writeToExcel(this.state.chartdata)}>导出excel</Button>
      </Affix>);
    return (
      <div>
        <Spin spinning={this.state.loading} >
          <Tabs defaultActiveKey="1" tabPosition="top" tabBarExtraContent={operations}>
            <TabPane tab="排序" key="1" >
              <ReletiveRankChart data={this.state.chartdata.排序} />
            </TabPane>
            <TabPane tab="利率" key="2" >
              <ReletiveCurveChart data={this.state.chartdata.国债} title="国债" />
              <ReletiveCurveChart data={this.state.chartdata.国开} title="国开" />
              <ReletiveCurveChart data={this.state.chartdata.进出口} title="口行" />
              <ReletiveCurveChart data={this.state.chartdata.农发} title="农发" />
              <ReletiveCurveChart data={this.state.chartdata.地方政府债} title="地方债" />
              <ReletiveCurveChart data={this.state.chartdata.利率互换} title="利率互换" />
            </TabPane>
            <TabPane tab="信用" key="3" >
              <ReletiveCurveChart data={this.state.chartdata.中票短融AAA} title="中票短融AAA" />
              <ReletiveCurveChart data={this.state.chartdata.中票短融AAplus} title="中票短融AA+" />
              <ReletiveCurveChart data={this.state.chartdata.中票短融AA} title="中票短融AA" />
              <ReletiveCurveChart data={this.state.chartdata.中票短融1年} title="中票短融1年" />
              <ReletiveCurveChart data={this.state.chartdata.中票短融3年} title="中票短融3年" />
              <ReletiveCurveChart data={this.state.chartdata.中票短融5年} title="中票短融5年" />
            </TabPane>
            <TabPane tab="期限" key="4" >
              <ReletiveCurveChart data={this.state.chartdata.一年} title="一年" />
              <ReletiveCurveChart data={this.state.chartdata.三年} title="三年" />
              <ReletiveCurveChart data={this.state.chartdata.五年} title="五年" />
              <ReletiveCurveChart data={this.state.chartdata.七年} title="七年" />
              <ReletiveCurveChart data={this.state.chartdata.十年} title="十年" />
            </TabPane>
            <TabPane tab="自选" key="5" >
              <ReletiveChartAll
                data={this.state.chartdata.all}
                options={this.state.labels}
                onChange={this.handleChange}
                selectdata={this.state.selectdata}
                chartGap={this.state.chartGap}
              />
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default ReletiveCurve;
