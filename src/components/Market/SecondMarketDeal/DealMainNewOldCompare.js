import React from 'react';
import { Row, Col, Divider } from 'antd';
import fetch from 'dva/fetch';
import moment from 'moment';
import styles from './DealMainNew.css';
import DealBarNew from './DealBarNew';
import DealBarCompare from './DealBarCompare';
import DealDatePicker from './DealDatePicker';

const R = require('ramda');

class DealMainNewOldCompare extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
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
  };

  getSonDataCompare = (d, bondtype, term = null) => {
    let dt = [];
    d.forEach((i) => {
      dt.push({ InsType: i.InsType, Term: i.Term, Amt: Math.round(i[`${bondtype}New`]), NewOld: 'New', Sum: Math.round(i[bondtype]) });
      dt.push({ InsType: i.InsType, Term: i.Term, Amt: Math.round(i[`${bondtype}Old`]), NewOld: 'Old', Sum: Math.round(i[bondtype]) });
    }); // 筛选债券类别
    if (term !== null) {
      dt = R.filter(R.propEq('Term', term))(dt);// 筛选期限
    }
    dt = R.sort(R.descend(R.prop('Sum')))(dt);// 升序排列
    return dt;
  };

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
          this.setState({ chartdata: ds.a });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };


  render() {
    const data = this.state.chartdata;
    return (
      <div>
        <DealDatePicker onChange={this.pickerChange} />
        <div className={styles.normal}>
          <h2>国债新老券</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Treasury', '1年及1年以下')} title="1年及1年以下" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Treasury', '1-3年')} title="1-3年" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Treasury', '3-5年')} title="3-5年" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Treasury', '5-7年')} title="5-7年" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Treasury', '7-10年')} title="7-10年" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Treasury', '10年以上')} title="10年以上" /></Col>
          </Row>
          <Divider />
          <h2>金债新老券</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Policy', '1年及1年以下')} title="1年及1年以下" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Policy', '1-3年')} title="1-3年" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Policy', '3-5年')} title="3-5年" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Policy', '5-7年')} title="5-7年" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Policy', '7-10年')} title="7-10年" /></Col>
            <Col span={4}><DealBarCompare data={this.getSonDataCompare(data, 'Policy', '10年以上')} title="10年以上" /></Col>
          </Row>
          <Divider />
          <h2>国债新券</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryNew', '1年及1年以下')} title="1年及1年以下" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债新券" selectedIns={this.props.selectedIns} bondterm="1年及1年以下" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryNew', '1-3年')} title="1-3年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债新券" selectedIns={this.props.selectedIns} bondterm="1-3年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryNew', '3-5年')} title="3-5年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债新券" selectedIns={this.props.selectedIns} bondterm="3-5年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryNew', '5-7年')} title="5-7年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债新券" selectedIns={this.props.selectedIns} bondterm="5-7年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryNew', '7-10年')} title="7-10年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债新券" selectedIns={this.props.selectedIns} bondterm="7-10年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryNew', '10年以上')} title="10年以上" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债新券" selectedIns={this.props.selectedIns} bondterm="10年以上" /></Col>
          </Row>
          <h2>国债老券</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryOld', '1年及1年以下')} title="1年及1年以下" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债老券" selectedIns={this.props.selectedIns} bondterm="1年及1年以下" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryOld', '1-3年')} title="1-3年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债老券" selectedIns={this.props.selectedIns} bondterm="1-3年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryOld', '3-5年')} title="3-5年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债老券" selectedIns={this.props.selectedIns} bondterm="3-5年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryOld', '5-7年')} title="5-7年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债老券" selectedIns={this.props.selectedIns} bondterm="5-7年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryOld', '7-10年')} title="7-10年" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债老券" selectedIns={this.props.selectedIns} bondterm="7-10年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'TreasuryOld', '10年以上')} title="10年以上" color={['Amt', '#BBFFFF-#008B8B']} bondtype="国债老券" selectedIns={this.props.selectedIns} bondterm="10年以上" /></Col>
          </Row>
          <Divider />
          <h2>金融债新券</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyNew', '1年及1年以下')} title="1年及1年以下" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债新券" selectedIns={this.props.selectedIns} bondterm="年及1年以下" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyNew', '1-3年')} title="1-3年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债新券" selectedIns={this.props.selectedIns} bondterm="1-3年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyNew', '3-5年')} title="3-5年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债新券" selectedIns={this.props.selectedIns} bondterm="3-5年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyNew', '5-7年')} title="5-7年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债新券" selectedIns={this.props.selectedIns} bondterm="5-7年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyNew', '7-10年')} title="7-10年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债新券" selectedIns={this.props.selectedIns} bondterm="7-10年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyNew', '10年以上')} title="10年以上" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债新券" selectedIns={this.props.selectedIns} bondterm="10年以上" /></Col>
          </Row>
          <h2>金融债老券</h2>
          <Row type="flex" justify="space-around">
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyOld', '1年及1年以下')} title="1年及1年以下" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债老券" selectedIns={this.props.selectedIns} bondterm="年及1年以下" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyOld', '1-3年')} title="1-3年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债老券" selectedIns={this.props.selectedIns} bondterm="1-3年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyOld', '3-5年')} title="3-5年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债老券" selectedIns={this.props.selectedIns} bondterm="3-5年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyOld', '5-7年')} title="5-7年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债老券" selectedIns={this.props.selectedIns} bondterm="5-7年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyOld', '7-10年')} title="7-10年" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债老券" selectedIns={this.props.selectedIns} bondterm="7-10年" /></Col>
            <Col span={4}><DealBarNew data={this.getSonData(data, 'PolicyOld', '10年以上')} title="10年以上" color={['Amt', '#FFFF00-#CD950C']} bondtype="金融债老券" selectedIns={this.props.selectedIns} bondterm="10年以上" /></Col>
          </Row>

        </div>
      </div>
    );
  }
}

export default DealMainNewOldCompare;
