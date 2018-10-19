import React from 'react';
import { Row, Col } from 'antd';
import request from '../../../../utils/request';
import styles from './AccMain.css';
import AccBar from './AccBar';

const R = require('ramda');

class AccMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      changeProfit: [],
      totalProfit: [],
      aiProfit: [],
      priceProfit: [],
      bpValue: [],
      yearlyRate: [],
      netyearlyRate: [],
      holdRate: [],
      bpChange: [],
      cost: [],
      netProfit: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const pms = request('/api/reportaccdetail');
    pms.then((datas) => {
      const ds = datas.data;
      this.setState({
        chartdata: ds,
        changeProfit: R.map((x) => { return { 策略: x.策略, 较上日盈亏: x.较上日盈亏 }; })(ds),
        totalProfit: R.map((x) => { return { 策略: x.策略, 总盈亏: x.总盈亏 }; })(ds),
        aiProfit: R.map((x) => { return { 策略: x.策略, 票息盈亏: x.票息盈亏 }; })(ds),
        priceProfit: R.map((x) => { return { 策略: x.策略, 净价盈亏: x.净价盈亏 }; })(ds),
        bpValue: R.map((x) => { return { 策略: x.策略, 基点价值: x.基点价值 }; })(ds),
        yearlyRate: R.map((x) => { return { 策略: x.策略, 年化收益率: x.年化收益率 }; })(ds),
        holdRate: R.map((x) => { return { 策略: x.策略, 持有期收益率: x.持有期收益率 }; })(ds),
        netyearlyRate: R.map((x) => { return { 策略: x.策略, 净年化收益率: x.净年化收益率 }; })(ds),
        bpChange: R.map((x) => { return { 策略: x.策略, 基点价值变动: x.基点价值变动 }; })(ds),
        cost: R.map((x) => { return { 策略: x.策略, 融资成本: x.融资成本 }; })(ds),
        netProfit: R.map((x) => { return { 策略: x.策略, 净盈亏: x.净盈亏 }; })(ds),
      });
    }).catch(err => ({ err }));
  }

  render() {
    return (
      <div className={styles.normal}>
        <Row gutter={24}>
          <Col span={8}><AccBar barData={this.state.totalProfit} ax1="策略" ax2="总盈亏" title="总盈亏" format="万" /></Col>
          <Col span={8}><AccBar barData={this.state.bpValue} ax1="策略" ax2="基点价值" title="基点价值" format="万" /></Col>
          <Col span={8}><AccBar barData={this.state.netProfit} ax1="策略" ax2="净盈亏" title="净盈亏" format="万" /></Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}><AccBar barData={this.state.cost} ax1="策略" ax2="融资成本" title="融资成本" format="万" /></Col>
          <Col span={8}><AccBar barData={this.state.bpChange} ax1="策略" ax2="基点价值变动" title="基点价值变动" format="万" /></Col>
          <Col span={8}><AccBar barData={this.state.changeProfit} ax1="策略" ax2="较上日盈亏" title="较上日盈亏" format="万" /></Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}><AccBar barData={this.state.yearlyRate} ax1="策略" ax2="年化收益率" title="年化收益率" format="%" /></Col>
          <Col span={8}><AccBar barData={this.state.netyearlyRate} ax1="策略" ax2="净年化收益率" title="净年化收益率" format="%" /></Col>
          <Col span={8}><AccBar barData={this.state.holdRate} ax1="策略" ax2="持有期收益率" title="持有期收益率" format="%" /></Col>
        </Row>
      </div>
    );
  }
}

export default AccMain;
