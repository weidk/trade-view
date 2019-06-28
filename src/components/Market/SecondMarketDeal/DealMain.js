import React from 'react';
import { Row, Col, Divider } from 'antd';
import fetch from 'dva/fetch';
import moment from 'moment';
import styles from './DealMain.css';
import DealBarChart from './DealBarChart';
import DealDatePicker from './DealDatePicker';

class DealMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      chartTermdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(10, 'days'), moment()]);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/marketdeal', {
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
      fetch('/api/markettermdeal', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartTermdata: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const d1 = this.state.chartdata.filter(item => item.种类 === '国债');
    const d2 = this.state.chartdata.filter(item => item.种类 === '金融债');
    const d3 = this.state.chartdata.filter(item => item.种类 === '短融');
    const d4 = this.state.chartdata.filter(item => item.种类 === '存单');
    const d5 = this.state.chartdata.filter(item => item.种类 === '中票/企业债');

    const dt1 = this.state.chartTermdata.filter(item => item.种类 === '一年');
    const dt2 = this.state.chartTermdata.filter(item => item.种类 === '三年');
    const dt3 = this.state.chartTermdata.filter(item => item.种类 === '五年');
    const dt4 = this.state.chartTermdata.filter(item => item.种类 === '七年十年');
    const dt5 = this.state.chartTermdata.filter(item => item.种类 === '大于十年');

    return (
      <div >
        <DealDatePicker onChange={this.pickerChange} />
        <div className={styles.normal}>
          <h2>现券市场成交情况（亿）</h2>
          <br />
        </div>
        <Row type="flex" justify="space-around">
          <Col span={4}><DealBarChart dealbardata={d1} title="国债" color={['数量', '#BBFFFF-#008B8B']} /></Col>
          <Col span={4}><DealBarChart dealbardata={d2} title="金融债" color={['数量', '#FFFF00-#CD950C']} /></Col>
          <Col span={4}><DealBarChart dealbardata={d3} title="短融" color={['数量', '#FF7256-#FF0000']} /></Col>
          <Col span={4}><DealBarChart dealbardata={d4} title="存单" color={['数量', '#90EE90-#008B00']} /></Col>
          <Col span={4}><DealBarChart dealbardata={d5} title="中票企业债" color={['数量', '#EE82EE-#9400D3']} /></Col>
        </Row>
        <Divider />
        <Row type="flex" justify="space-around">
          <Col span={4}><DealBarChart dealbardata={dt1} title="一年" color={['数量', '#BBFFFF-#008B8B']} /></Col>
          <Col span={4}><DealBarChart dealbardata={dt2} title="三年" color={['数量', '#FFFF00-#CD950C']} /></Col>
          <Col span={4}><DealBarChart dealbardata={dt3} title="五年" color={['数量', '#FF7256-#FF0000']} /></Col>
          <Col span={4}><DealBarChart dealbardata={dt4} title="七&十年" color={['数量', '#90EE90-#008B00']} /></Col>
          <Col span={4}><DealBarChart dealbardata={dt5} title="大于十年" color={['数量', '#EE82EE-#9400D3']} /></Col>
        </Row>
      </div>
    );
  }
}

export default DealMain;
