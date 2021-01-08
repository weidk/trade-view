import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker, Row, Col, Button } from 'antd';
import { DataView } from '@antv/data-set';
import moment from 'moment';
import fetch from 'dva/fetch';


const ExportJsonExcel = require('js-export-excel');

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;


class ConvertBondRatioNew extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(365, 'days'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/convprationew', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  writeToExcel = (data) => {
    const option = {};
    option.fileName = '转债溢价';
    option.datas = [
      {
        sheetData: data,
        sheetHeader: Object.keys(data[0]),
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }


  render() {
    const dv = new DataView();
    dv.source(this.state.chartdata).transform({
      type: 'fold',
      fields: ['加权', '纯债', '100'],
      key: 'type',
      value: 'value',
    });

    return (
      <div>
        <Row>
          <Col span={20}>
            <a>选择查询区间 ：</a>
            <RangePicker
              onChange={this.pickerChange}
              defaultValue={[moment().subtract(365, 'days'), moment()]}
              format={dateFormat}
            />
          </Col>
          <Col span={2} offset={2}>
            <Button type="primary" onClick={() => this.writeToExcel(this.state.chartdata)}>导出excel</Button>
          </Col>
        </Row>
        <Chart height={660} padding="77" data={dv} forceFit >
          <Tooltip />
          <Legend />
          <Axis name="date" />
          <Axis name="value" />
          <Geom
            type="line"
            position="date*value"
            size={2}
            shape={'smooth'}
            color={'type'}
          />
        </Chart>
      </div>
    );
  }
}


export default ConvertBondRatioNew;
