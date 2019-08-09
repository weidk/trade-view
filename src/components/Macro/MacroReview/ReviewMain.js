import React from 'react';
import fetch from 'dva/fetch';
import { Button, Icon, message, Spin, Row, Col } from 'antd';
import XLSX from 'xlsx';
import styles from './ReviewMain.css';
import ComsumReturnAreaChart from './ComsumReturnAreaChart.js';
import SignalChart from './SignalChart.js';
import DrawDownChart from './DrawDownChart.js';
import ReviewDetail from './ReviewDetail.js';

const ExportJsonExcel = require('js-export-excel');

const DemoData = [{ date: '2010-07-11', price: 100, position: 1 }, { date: '2010-07-12', price: 99.546, position: 0 }, { date: '2010-07-13', price: 99.4132, position: -1 }, { date: '2010-07-14', price: 99.2132, position: -2 }, { date: '2010-07-15', price: 99.6132, position: 3 }];

class ReviewMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      loading: false,
      detail: [],
    };
  }
  onImportExcel = (file) => {
    // 获取上传的文件对象
    const { files } = file.target;
    // 通过FileReader对象读取文件
    const fileReader = new window.FileReader();
    fileReader.onload = (event) => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = []; // 存储获取到的数据
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
          // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            break; // 如果只取第一张表，就取消注释这行
          }
        }
        this.fetchData(data);
      } catch (e) {
      // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件类型不正确');
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
  };

  fetchData = (values) => {
    try {
      this.setState({ loading: true });
      fetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({ data: values }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({
            chartdata: ds,
            detail: [ds[0]],
          });
        });
        this.setState({
          loading: false,
        });
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      message.error(error);
    }
  };

  writeToExcel = (data) => {
    const option = {};
    option.fileName = '回测模板';
    option.datas = [
      {
        sheetData: data,
        sheetHeader: ['date', 'price', 'position'],
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  writeToExcelResult = (data) => {
    const Detail = data.slice(0, 1).map((v) => {
      const obj = {};
      obj.收益回撤比 = v.Returnperdrawdown;
      obj.年化收益率 = v.YearlyReturn;
      obj.交易次数 = v.DealTimes;
      obj.胜率 = v.WinRate;
      obj.最大回撤 = v.MaxDrawDown;
      obj.波动率 = v.Volatility;
      return obj;
    });
    const dataTs = data.map((v) => {
      const obj = {};
      obj.date = v.date;
      obj.price = v.price;
      obj.position = v.position;
      obj.beta = v.beta;
      obj.comsumreturn = v.comsumreturn;
      obj.drawdown = v.drawdown;
      return obj;
    });
    const option = {};
    option.fileName = '回测结果';
    option.datas = [
      {
        sheetData: Detail,
        sheetHeader: ['收益回撤比', '年化收益率', '交易次数', '胜率', '最大回撤', '波动率'],
        sheetName: '盈亏表现',
      },
      {
        sheetData: dataTs,
        sheetHeader: ['date', 'price', 'position', 'beta', 'comsumreturn', 'drawdown'],
        sheetName: '回测流水',
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  render() {
    return (
      <div className={styles.normal}>
        <Row>
          <Col span={16}>
            <Button className={styles['upload-wrap']}>
              <Icon type="upload" />
              <input
                className={styles['file-uploader']} type="file" accept=".xlsx, .xls" onChange={this.onImportExcel}
              />
              <span className={styles['upload-text']}>上传数据</span>
            </Button>
            <p className={styles['upload-tip']}>支持 .xlsx、.xls 格式的文件</p>
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={() => this.writeToExcelResult(this.state.chartdata)}>结果下载</Button>
          </Col>
          <Col span={2} offset={2}>
            <Button type="primary" onClick={() => this.writeToExcel(DemoData)}>模板下载</Button>
          </Col>
        </Row>
        <Spin spinning={this.state.loading} tip="计算ing...">
          <ReviewDetail data={this.state.detail} />
          <br />
          <ComsumReturnAreaChart data={this.state.chartdata} />
          <SignalChart data={this.state.chartdata} />
          <DrawDownChart data={this.state.chartdata} />
        </Spin>
      </div>
    );
  }
}

export default ReviewMain;
