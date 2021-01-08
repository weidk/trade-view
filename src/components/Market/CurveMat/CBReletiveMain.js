import React from 'react';
import { Affix, Tabs, Button, DatePicker, Spin } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
import ReletiveRankChart from './ReletiveRankChart';
import ReletiveChartAll from './ReletiveChartAll';


const TabPane = Tabs.TabPane;
const ExportJsonExcel = require('js-export-excel');
const R = require('ramda');

class CBReletiveMain extends React.Component {
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
      fetch('/api/cbreletivecurve', {
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
    option.fileName = '转债相对价值数据';
    const sheetHeaderName = Object.keys(data.all[0]);
    option.datas = [
      {
        sheetData: data.all,
        sheetName: '相对价值',
        sheetHeader: sheetHeaderName,
      }];
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
            <TabPane tab="自选" key="2" >
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

export default CBReletiveMain;
