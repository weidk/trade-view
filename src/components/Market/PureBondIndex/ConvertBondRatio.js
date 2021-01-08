import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import { DatePicker, Row, Col, Button, Divider } from 'antd';
import { DataView } from '@antv/data-set';
import moment from 'moment';
import fetch from 'dva/fetch';

const ExportJsonExcel = require('js-export-excel');

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;

class ConvertBondRatio extends React.Component {
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
      fetch('/api/convpratio', {
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
        sheetHeader: ['日期', '简单溢价率', '加权溢价率', '简单波动率', '加权波动率', '中债转债指数', '正股估算'],
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }


  render() {
    const dv = new DataView();
    dv.source(this.state.chartdata).transform({
      type: 'fold',
      fields: ['加权溢价率', '简单溢价率'],
      key: 'type',
      value: 'value',
    });
    const dvvol = new DataView();
    dvvol.source(this.state.chartdata).transform({
      type: 'fold',
      fields: ['加权波动率', '简单波动率'], // 展开字段集
      key: 'type', // key字段
      value: 'value', // value字段
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

        <Divider> 转股溢价率 </Divider>
        <Chart height={660} padding="77" data={dv} forceFit >
          <Tooltip />
          <Legend />
          <Axis name="日期" />
          <Axis name="value" />
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
          <Axis name="中债转债指数" position="right" />

          <Geom
            type="line"
            position="日期*中债转债指数"
            size={2}
            shape={'smooth'}
            color="#ec6663"
          />
        </Chart>
        <Divider> 隐含波动率 </Divider>
        <Chart height={660} padding="77" data={dvvol} forceFit >
          <Tooltip />
          <Legend />
          <Axis name="日期" />
          <Axis name="value" />
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
          <Axis name="中债转债指数" position="right" />

          <Geom
            type="line"
            position="日期*中债转债指数"
            size={2}
            shape={'smooth'}
            color="#ec6663"
          />
        </Chart>
      </div>
    );
  }
}


export default ConvertBondRatio;
