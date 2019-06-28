import React from 'react';
import { Divider, Button, Row, Col } from 'antd';
import fetch from 'dva/fetch';
import moment from 'moment';
import IssueDatePicker from './IssueDatePicker';
import IssueChart from './IssueChart';
import IssueTable from './IssueTable';

// Date.prototype.format = function (fmt) {
//   const o = {
//     'M+': this.getMonth() + 1, // 月份
//     'd+': this.getDate(), // 日
//     'h+': this.getHours(), // 小时
//     'm+': this.getMinutes(), // 分
//     's+': this.getSeconds(), // 秒
//     'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
//     S: this.getMilliseconds(), // 毫秒
//   };
//   if (/(y+)/.test(fmt)) {
//     fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
//   }
//   for (const k in o) {
//     if (new RegExp(`(${k})`).test(fmt)) {
//       fmt =
// fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) :
// ((`00${o[k]}`).substr((`${o[k]}`).length)));
//     }
//   }
//   return fmt;
// };

const ExportJsonExcel = require('js-export-excel');

class Issue extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(10, 'days'), moment()]);
  }

  writeToExcel = (data) => {
    const excelData = data.map((x) => {
      return { term: x.term,
        rank: x.rank,
        yieldlow: x.yield[1],
        dash0: '~',
        yieldhigh: x.yield[0],
        bondnamelow: x.bondname[1],
        dash1: '~',
        bondnamehigh: x.bondname[0],
      };
    });
    const option = {};
    option.fileName = '一级走廊图数据';
    option.datas = [
      {
        sheetData: excelData,
        sheetHeader: ['term', 'rank', 'yieldlow', ' ', 'yieldhigh', 'bondnamelow', ' ', 'bondnamehigh'],
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/issueyield', {
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
  };


  render() {
    // console.log(this.state.chartdata);
    return (
      <div>
        <Row>
          <Col span={20}>
            <IssueDatePicker onChange={this.pickerChange} />
          </Col>
          <Col span={2} offset={2}>
            <Button type="primary" onClick={() => this.writeToExcel(this.state.chartdata)}>导出excel</Button>
          </Col>
        </Row>
        <Divider />
        <br />
        <IssueChart data={this.state.chartdata} />
        <br />
        <IssueTable data={this.state.chartdata} />
      </div>
    );
  }
}

export default Issue;
