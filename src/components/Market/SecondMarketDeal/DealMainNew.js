import React from 'react';
import { Row, Col, Divider } from 'antd';
import fetch from 'dva/fetch';
import moment from 'moment';
import styles from './DealMainNew.css';
import DealBarNew from './DealBarNew';
import DealDatePicker from './DealDatePicker';

const R = require('ramda');

class DealMainNew extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      cddata: [],
      absdata: [],
      mtndata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(10, 'days'), moment()]);
  }

  getSonData = (d, bondtype, term = null) => {
    let dt = [];
    d.forEach(i =>
      dt.push({ InsType: i.InsType, Term: i.Term, Amt: i[bondtype] })); // 筛选债券类别
    // d.forEach(i => dt.push(R.pick(['InsType', 'Term', bondtype])(i))); // 筛选债券类别
    if (term !== null) {
      dt = R.filter(R.propEq('Term', term))(dt);// 筛选期限
    }
    dt = R.sort(R.descend(R.prop('Amt')))(dt);// 升序排列
    return dt;
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/marketdealnew', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds.a, cddata: ds.b, absdata: ds.c, mtndata: ds.d });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }


  render() {
    const data = this.state.chartdata;
    return (
      <div>
        <DealDatePicker onChange={this.pickerChange} />
        <div className={styles.normal}>
          <h2>国债</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Treasury', '1年及1年以下')} title="1年及1年以下" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债" selectedIns={this.props.selectedIns} bondterm="1年及1年以下" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Treasury', '1-3年')} title="1-3年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债" selectedIns={this.props.selectedIns} bondterm="1-3年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Treasury', '3-5年')} title="3-5年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债" selectedIns={this.props.selectedIns} bondterm="3-5年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Treasury', '5-7年')} title="5-7年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债" selectedIns={this.props.selectedIns} bondterm="5-7年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Treasury', '7-10年')} title="7-10年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债" selectedIns={this.props.selectedIns} bondterm="7-10年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Treasury', '10年以上')} title="10年以上" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债" selectedIns={this.props.selectedIns} bondterm="10年以上" /></Col>
          </Row>
          <Divider />
          <h2>金融债</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Policy', '1年及1年以下')} title="1年及1年以下" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债" selectedIns={this.props.selectedIns} bondterm="年及1年以下" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Policy', '1-3年')} title="1-3年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债" selectedIns={this.props.selectedIns} bondterm="1-3年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Policy', '3-5年')} title="3-5年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债" selectedIns={this.props.selectedIns} bondterm="3-5年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Policy', '5-7年')} title="5-7年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债" selectedIns={this.props.selectedIns} bondterm="5-7年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Policy', '7-10年')} title="7-10年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债" selectedIns={this.props.selectedIns} bondterm="7-10年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'Policy', '10年以上')} title="10年以上" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债" selectedIns={this.props.selectedIns} bondterm="10年以上" /></Col>
          </Row>
          <Divider />
          <h2>地方债</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarNew data={this.getSonData(data, 'LocalGoverment', '1年及1年以下')} title="1年及1年以下" color={['Amt', '#EE82EE-#9400D3']} bondtype="地方债" selectedIns={this.props.selectedIns} bondterm="1年及1年以下" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'LocalGoverment', '1-3年')} title="1-3年" color={['Amt', '#EE82EE-#9400D3']} bondtype="地方债" selectedIns={this.props.selectedIns} bondterm="1-3年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'LocalGoverment', '3-5年')} title="3-5年" color={['Amt', '#EE82EE-#9400D3']} bondtype="地方债" selectedIns={this.props.selectedIns} bondterm="3-5年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'LocalGoverment', '5-7年')} title="5-7年" color={['Amt', '#EE82EE-#9400D3']} bondtype="地方债" selectedIns={this.props.selectedIns} bondterm="5-7年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'LocalGoverment', '7-10年')} title="7-10年" color={['Amt', '#EE82EE-#9400D3']} bondtype="地方债" selectedIns={this.props.selectedIns} bondterm="7-10年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'LocalGoverment', '10年以上')} title="10年以上" color={['Amt', '#EE82EE-#9400D3']} bondtype="地方债" selectedIns={this.props.selectedIns} bondterm="10年以上" /></Col>
          </Row>
          <Divider />
          <h2>信用债</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarNew data={this.getSonData(this.state.cddata, 'CDS')} title="存单" color={['Amt', '#FF7256-#FF0000']} selectedIns={this.props.selectedIns} bondtype="存单" bondterm="合计" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(this.state.absdata, 'ABS')} title="ABS" color={['Amt', '#FF7256-#FF0000']} selectedIns={this.props.selectedIns} bondtype="ABS" bondterm="合计" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(this.state.mtndata, 'CPMTNCorporate', '1年及1年以下')} title="1年及以下 CP" color={['Amt', '#FF7256-#FF0000']} selectedIns={this.props.selectedIns} bondtype="短融" bondterm="1年及1年以下" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(this.state.mtndata, 'CPMTNCorporate', '1-3年')} title="1-3年 MTN/企业债" color={['Amt', '#FF7256-#FF0000']} selectedIns={this.props.selectedIns} bondtype="中票/企业债" bondterm="1-3年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(this.state.mtndata, 'CPMTNCorporate', '3-5年')} title="3-5年 MTN/企业债" color={['Amt', '#FF7256-#FF0000']} selectedIns={this.props.selectedIns} bondtype="中票/企业债" bondterm="3-5年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(this.state.mtndata, 'CPMTNCorporate', '5年以上')} title="5年以上 MTN/企业债" color={['Amt', '#FF7256-#FF0000']} selectedIns={this.props.selectedIns} bondtype="中票/企业债" bondterm="5-7年" /></Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default DealMainNew;
