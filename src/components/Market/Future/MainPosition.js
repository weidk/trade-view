import React from 'react';
import { Chart, Tooltip, Legend, Axis, Geom, View } from 'bizcharts';
import { DatePicker, Divider, Radio } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
// import styles from './MainPosition.css';

const dateFormat = 'YYYY-MM-DD';
const RangePicker = DatePicker.RangePicker;
const R = require('ramda');

let insn = '中信期货';
let startDay = moment().subtract(90, 'days').format('YYYY-MM-DD');
let endDay = moment().format('YYYY-MM-DD');


class MainPosition extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdataT: [],
      // chartdataTB: [],
      // chartdataTS: [],
      areadataT: [],
      chartdataTF: [],
      // chartdataTFB: [],
      // chartdataTFS: [],
      areadataTF: [],
    };
  }

  componentDidMount() {
    this.GetData(startDay, endDay, insn);
  }

  GetData = (s, e, ins) => {
    try {
      fetch('/api/futurepositionts', {
        method: 'POST',
        body: JSON.stringify(
          { start: s,
            end: e,
            insname: ins,
          }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const Tds = R.filter(R.propEq('productid', 'T'))(ds);
          // const TdsB = R.filter(R.propEq('datatypeid', '多'))(Tds);
          // const TdsS = R.filter(R.propEq('datatypeid', '空'))(Tds);
          const TFds = R.filter(R.propEq('productid', 'TF'))(ds);
          // const TFdsB = R.filter(R.propEq('datatypeid', '多'))(TFds);
          // const TFdsS = R.filter(R.propEq('datatypeid', '空'))(TFds);
          this.setState(
            { chartdataT: Tds,
              chartdataTF: TFds });
        });
      });

      fetch('/api/futurenetpositionts', {
        method: 'POST',
        body: JSON.stringify(
          { start: s,
            end: e,
            insname: ins,
          }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const Tds = R.filter(R.propEq('productid', 'T'))(ds);
          const TFds = R.filter(R.propEq('productid', 'TF'))(ds);
          this.setState({ areadataT: Tds, areadataTF: TFds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange = (value) => {
    try {
      insn = value.target.value;
      fetch('/api/futurepositionts', {
        method: 'POST',
        body: JSON.stringify(
          { start: startDay,
            end: endDay,
            insname: insn,
          }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const Tds = R.filter(R.propEq('productid', 'T'))(ds);
          // const TdsB = R.filter(R.propEq('datatypeid', '多'))(Tds);
          // const TdsS = R.filter(R.propEq('datatypeid', '空'))(Tds);
          const TFds = R.filter(R.propEq('productid', 'TF'))(ds);
          // const TFdsB = R.filter(R.propEq('datatypeid', '多'))(TFds);
          // const TFdsS = R.filter(R.propEq('datatypeid', '空'))(TFds);
          this.setState(
            { chartdataT: Tds,
              chartdataTF: TFds });
        });
      });

      fetch('/api/futurenetpositionts', {
        method: 'POST',
        body: JSON.stringify(
          { start: startDay,
            end: endDay,
            insname: insn,
          }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const Tds = R.filter(R.propEq('productid', 'T'))(ds);
          const TFds = R.filter(R.propEq('productid', 'TF'))(ds);
          this.setState({ areadataT: Tds, areadataTF: TFds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  pickerChange = (values) => {
    startDay = values[0].format('YYYY-MM-DD');
    endDay = values[1].format('YYYY-MM-DD');
    try {
      fetch('/api/futurepositionts', {
        method: 'POST',
        body: JSON.stringify(
          { start: startDay,
            end: endDay,
            insname: insn,
          }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const Tds = R.filter(R.propEq('productid', 'T'))(ds);
          // const TdsB = R.filter(R.propEq('datatypeid', '多'))(Tds);
          // const TdsS = R.filter(R.propEq('datatypeid', '空'))(Tds);
          const TFds = R.filter(R.propEq('productid', 'TF'))(ds);
          // const TFdsB = R.filter(R.propEq('datatypeid', '多'))(TFds);
          // const TFdsS = R.filter(R.propEq('datatypeid', '空'))(TFds);
          this.setState(
            { chartdataT: Tds,
              chartdataTF: TFds });
        });
      });

      fetch('/api/futurenetpositionts', {
        method: 'POST',
        body: JSON.stringify(
          { start: startDay,
            end: endDay,
            insname: insn,
          }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const Tds = R.filter(R.propEq('productid', 'T'))(ds);
          const TFds = R.filter(R.propEq('productid', 'TF'))(ds);
          this.setState({ areadataT: Tds, areadataTF: TFds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    return (
      <div>
        <a>选择查询区间 ：</a>
        <RangePicker
          onChange={this.pickerChange}
          defaultValue={[moment().subtract(90, 'days'), moment()]}
          format={dateFormat}
        />
        <Radio.Group defaultValue="中信期货" buttonStyle="solid" onChange={this.handleChange}>
          <Radio.Button value="中信期货">中信期货</Radio.Button>
          <Radio.Button value="国泰君安">国泰君安</Radio.Button>
          <Radio.Button value="永安期货">永安期货</Radio.Button>
          <Radio.Button value="海通期货">海通期货</Radio.Button>
          <Radio.Button value="广发期货">广发期货</Radio.Button>
          <Radio.Button value="上海东证">上海东证</Radio.Button>
          <Radio.Button value="华泰期货">华泰期货</Radio.Button>
          <Radio.Button value="银河期货">银河期货</Radio.Button>
          <Radio.Button value="中信建投">中信建投</Radio.Button>
          <Radio.Button value="平安期货">平安期货</Radio.Button>
          <Radio.Button value="新湖期货">新湖期货</Radio.Button>
        </Radio.Group>
        <Divider />
        <Chart height={400} forceFit padding="auto">
          <Legend />
          <Tooltip />
          <View data={this.state.areadataT} >
            <Axis name="netposition" position="right" />
            <Geom
              type="area"
              position="tradingday*netposition"
              color="#D3D3D3"
              shape={'smooth'}
            />
          </View>
          <View data={this.state.chartdataT} >
            <Axis name="position" />
            <Axis name="tradingday" />
            <Geom
              type="line"
              position="tradingday*position"
              size={3}
              color={'type'}
              shape={'smooth'}
              style={['type', {
                lineDash: (type) => {
                  if (type.indexOf('空') === 0) {
                    return [4, 4];
                  }
                },
              }]}
            />
          </View>
        </Chart>
        <Divider />
        <Chart height={400} forceFit padding="auto">
          <Legend />
          <Tooltip />
          <View data={this.state.areadataTF} >
            <Axis name="netposition" position="right" />
            <Geom
              type="area"
              position="tradingday*netposition"
              color="#D3D3D3"
              shape={'smooth'}
            />
          </View>
          <View data={this.state.chartdataTF} >
            <Axis name="position" />
            <Axis name="tradingday" />
            <Geom
              type="line"
              position="tradingday*position"
              size={3}
              color={'type'}
              shape={'smooth'}
              style={['type', {
                lineDash: (type) => {
                  if (type.indexOf('空') === 0) {
                    return [4, 4];
                  }
                },
              }]}
            />
          </View>
        </Chart>
      </div>
    );
  }
}
export default MainPosition;
