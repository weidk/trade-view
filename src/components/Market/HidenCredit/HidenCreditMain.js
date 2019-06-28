import React from 'react';
import fetch from 'dva/fetch';
import moment from 'moment';
import { Input, Modal, Spin, Button, Row, Col } from 'antd';
import styles from './HidenCreditMain.css';
import HidenDatePicker from './HidenDatePicker';
import HidenDateTable from './HidenDateTable';
import HidenCreditHistoryTable from './HidenCreditHistoryTable';

const ExportJsonExcel = require('js-export-excel');

const Search = Input.Search;
// const Option = Select.Option;


class HidenCreditMain extends React.Component {
  constructor() {
    super();
    this.state = {
      tableData: [],
      loading: false,
      visible: false,
      bondname: '',
      changeHistoryData: [],
      loading2: false,
      market: '.IB',
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(2, 'days'), moment().subtract(1, 'days')]);
  }

  onTableClick = (record) => {
    try {
      this.setState({
        visible: true,
        bondname: record.NAME,
        loading2: true,
      });
      const bondCode = record.CODE;
      fetch('/api/hidencreditchangehistory', {
        method: 'POST',
        body: JSON.stringify({ code: bondCode }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({
            changeHistoryData: ds,
            loading2: false,
          });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYYMMDD');
      const endDay = values[1].format('YYYYMMDD');
      this.setState({ loading: true });
      fetch('/api/hidencredit', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          // console.log(ds);
          this.setState({
            tableData: ds,
            loading: false });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
      this.setState({
        loading: false });
    }
  }

  writeToExcel = (data) => {
    const option = {};
    option.fileName = '隐含评级调整';
    option.datas = [
      {
        sheetData: data,
        sheetName: '隐含评级调整',
        sheetHeader: ['简称', '代码', '发行人', '旧评级', '评级日1', '新评级', '评级日2', '中债估值', '剩余期限', '评级变动'],
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  render() {
    // const selectAfter = (
    //   <Select
    //     defaultValue=".IB"
    //     style={{ width: 80 }}
    //     onChange={(value) => {
    //       this.setState({
    //         market: value,
    //       });
    //     }}
    //   >
    //     <Option value=".IB">.IB</Option>
    //     <Option value=".SH">.SH</Option>
    //     <Option value=".SZ">.SZ</Option>
    //   </Select>
    // );
    return (
      <div className={styles.normal}>
        <Row>
          <Col span={12}>
            <HidenDatePicker onChange={this.pickerChange} />
          </Col>
          <Col span={8}>
            <Search
              placeholder="请输入债券代码，带市场后缀(.IB/.SH/.SZ)"
              // addonAfter={selectAfter}
              onSearch={(value) => {
                try {
                  this.setState({
                    visible: true,
                    bondname: value,
                    loading2: true,
                  });
                  const bondCode = value;
                  fetch('/api/hidencreditchangehistory', {
                    method: 'POST',
                    body: JSON.stringify({ code: bondCode }),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }).then((response) => {
                    response.json().then((ds) => {
                      this.setState({
                        changeHistoryData: ds,
                        loading2: false,
                      });
                    });
                  });
                } catch (error) {
                  // console.log('error: ', error);
                }
              }}
            />
          </Col>
          <Col span={2} offset={2}><Button type="primary" onClick={() => this.writeToExcel(this.state.tableData)}>导出excel</Button></Col>
        </Row>
        <br />
        <Spin spinning={this.state.loading} tip="该查询耗时较长，请耐心等待...">
          <HidenDateTable data={this.state.tableData} changehistory={this.onTableClick} />
        </Spin>

        <Modal
          title={`${this.state.bondname}    隐含评级变动历史`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width="50vw"
          visible={this.state.visible}
          destroyOnClose="true"
        >
          <HidenCreditHistoryTable data={this.state.changeHistoryData} load={this.state.loading2} />
        </Modal>
      </div>
    );
  }
}

export default HidenCreditMain;
