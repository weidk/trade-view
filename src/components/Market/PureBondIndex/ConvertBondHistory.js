import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker, Row, Col, Button, Select } from 'antd';
import { DataView } from '@antv/data-set';
import moment from 'moment';
import fetch from 'dva/fetch';

const ExportJsonExcel = require('js-export-excel');

const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

let selectBond = '110030.SH';

class ConvertBondHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      codelist: [],
      datevalue: [moment().subtract(365, 'days'), moment()],
    };
  }

  componentDidMount() {
    try {
      fetch('/api/getcbondlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ codelist: ds.map(d => <Option key={d.code}>{d.code}</Option>) });
        });
      });
    } catch (error) {
      console.log(error);
    }
    this.pickerChange([moment().subtract(365, 'days'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/cbhistory', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay, code: selectBond }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          console.log(ds);
          this.setState({ chartdata: ds, datevalue: values });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange=(value) => {
    selectBond = value;
    this.pickerChange(this.state.datevalue);
  }

  writeToExcel = (data) => {
    const option = {};
    option.fileName = '转债溢价';
    option.datas = [
      {
        sheetData: data,
        sheetHeader: ['转股溢价率', '纯债溢价率', '收盘价', '日期'],
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }


  render() {
    const dv = new DataView();
    dv.source(this.state.chartdata).transform({
      type: 'fold',
      fields: ['转股溢价率', '纯债溢价率'], // 展开字段集
      key: 'type', // key字段
      value: 'value', // value字段
    });

    return (
      <div>
        <Row>
          <Col span={12}>
            <a>选择查询区间 ：</a>
            <RangePicker
              onChange={this.pickerChange}
              defaultValue={[moment().subtract(365, 'days'), moment()]}
              format={dateFormat}
            />
          </Col>
          <Col span={8} >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="请输入转债简称"
              onChange={this.handleChange}
              defaultValue="110030.SH"
            >
              {this.state.codelist}
            </Select>
          </Col>
          <Col span={2} offset={2}>
            <Button type="primary" onClick={() => this.writeToExcel(this.state.chartdata)}>导出excel</Button>
          </Col>
        </Row>

        <br />
        <Chart height={600} data={dv} forceFit padding="77" >
          <Tooltip />
          <Legend />
          <Axis name="日期" />
          <Axis name="value" />

          <Axis name="收盘价" position="left" />
          <Geom
            type="line"
            position="日期*收盘价"
            size={2}
            shape={'smooth'}
            color="#ec6663"
          />
          <Geom
            type="line"
            position="日期*value"
            size={2}
            shape={'smooth'}
            color={'type'}
            style={{
              lineDash: [4, 4],
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default ConvertBondHistory;
