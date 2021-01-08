import React from 'react';
import fetch from 'dva/fetch';
import moment from 'moment';
import { Radio, DatePicker, Button, Spin } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from 'bizcharts';
import styles from './BondScatterMain.css';

// const R = require('ramda');

class BondScatterMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      bondtype: '国债',
      queryDate: moment().format('YYYYMMDD'),
      loading: false,
      // dealbonds: [],
      // isAll: true,
    };
  }

  onChange = (e) => {
    // this.fetchData(e.target.value);
    this.setState({ bondtype: e.target.value });
  };

  onDateChange = (date, dateString) => {
    this.setState({ queryDate: dateString });
  };

  onSwitchHandle = (e) => {
    if (e) {
      this.setState({ isAll: true });
    } else {
      this.setState({ isAll: false });
    }
  }

  handleSearch = () => {
    this.fetchData();
  }

  fetchData = () => {
    try {
      this.setState({ loading: true });
      fetch('/api/bondincurve', {
        method: 'POST',
        body: JSON.stringify({ bondtype: this.state.bondtype, queryDate: this.state.queryDate }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds, loading: false });
        });
      });
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  }


  render() {
    return (
      <div className={styles.normal}>

        <Radio.Group onChange={this.onChange} defaultValue="国债">
          <Radio value={'国债'}>国债</Radio>
          <Radio value={'国开'}>国开</Radio>
          <Radio value={'农发'}>农发</Radio>
          <Radio value={'进出'}>口行</Radio>
        </Radio.Group>
        <DatePicker onChange={this.onDateChange} defaultValue={moment()} format={'YYYYMMDD'} />
        <Button type="primary" onClick={this.handleSearch}>查询</Button>
        {/* <Switch checkedChildren="全部" unCheckedChildren="活跃" defaultChecked onChange={this.onSwitchHandle} />*/}
        <Spin spinning={this.state.loading}>
          <Chart height={400} data={this.state.chartdata} forceFit padding="auto">
            <Axis name="TERM" />
            <Axis name="YIELD" />
            <Tooltip />
            <Geom
              type="point"
              position="TERM*YIELD"
              size={5}
              // color={['CODE', (code) => {
              //   if (code === 'CURVE') { return '#53ab53'; } else if (this.state.isAll) {
              //     return '#ec6663';
              //   } else if (this.state.dealbonds.indexOf(code) > -1) {
              //     return '#ec6663';
              //   } else {
              //     return '#DCDCDC';
              //   }
              // }]}
              color={['CODE', (code) => {
                if (code === 'CURVE') { return '#53ab53'; } else {
                  return '#ec6663';
                }
              }]}
              opacity={['CODE', (code) => {
                if (code === 'CURVE') { return 0; } else { return 1; }
              }]}
              tooltip={['TERM*YIELD*CODE', (TERM, YIELD, CODE) => {
                return {
                  title: `${TERM} 年`,
                  name: CODE,
                  value: YIELD,
                };
              }]}
            />
            <Geom
              type="line"
              position="TERM*YIELD"
              size={2}
              color={['CODE', (code) => {
                if (code === 'CURVE') { return '#53ab53'; } else { return '#ec6663'; }
              }]}
              opacity={['CODE', (code) => {
                if (code === 'CURVE') { return 1; } else { return 0; }
              }]}
              tooltip={['TERM*YIELD*CODE', (TERM, YIELD, CODE) => {
                return {
                  title: `${TERM} 年`,
                  name: CODE,
                  value: YIELD,
                };
              }]}
            />
          </Chart>
        </Spin>
      </div>
    );
  }
}

export default BondScatterMain;
