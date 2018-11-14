import React from 'react';
import moment from 'moment';
import fetch from 'dva/fetch';
import styles from './BankMain.css';
import MyDatePicker from '../MyDatePicker';
import china from '../../../../../china.json';
import ChinaChart from './ChinaChart';
import RelativeBubbleChart from '../Relative/RelativeBubbleChart';
import TraderBankTsChart from './TraderBankTsChart';

const R = require('ramda');

const defaultRange = [moment('1..1', 'DDD DDDD'), moment()];

class BankMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      relativeData: [],
      modaldata: [],
      titlename: '',
      visible: false,
    };
  }
  componentDidMount() {
    this.pickerChange(defaultRange);
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      this.setState({ start: startDay,
        end: endDay,
      });
      fetch('/api/banksgeo', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const userData = [];
          const features = china.features;
          for (let i = 0; i < features.length; i += 1) {
            const name = features[i].properties.name;
            const info = R.find(R.propEq('NAME', name))(ds);
            if (typeof (info) !== 'undefined') {
              userData.push({
                name,
                value: info.AMT,
              });
            } else {
              userData.push({
                name,
                value: 0,
              });
            }
          }
          this.setState({ chartdata: userData });
        });
      });

      fetch('/api/banktraderrelative', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ relativeData: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  showModal = (ev) => {
    try {
      const tradername = ev.data._origin.USERNAME;/* eslint no-underscore-dangle: 0 */
      const orgname = ev.data._origin.ORGANIZATIONNAME;/* eslint no-underscore-dangle: 0 */
      fetch('/api/traderbankts', {
        method: 'POST',
        body: JSON.stringify({ org: orgname, name: tradername }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((dsorg) => {
          this.setState({ visible: true, modaldata: dsorg, titlename: `${tradername}-${orgname}` });
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

  render() {
    return (
      <div className={styles.normal}>
        <MyDatePicker title="选择区间：" termRange={defaultRange} onChangeHandle={this.pickerChange} />
        <ChinaChart
          data={this.state.chartdata}
          width={550}
          height={500}
          title="银行客户申购次数地理分布"
        />
        <RelativeBubbleChart
          title="银行申购次数与交易员粘性"
          data={this.state.relativeData}
          doubleClickHandle={this.showModal}
        />
        <TraderBankTsChart
          title={`${this.state.titlename} 申购次数走势`}
          data={this.state.modaldata}
          visible={this.state.visible}
          handleOk={() => {
            this.setState({
              visible: false,
            });
          }}
          handleCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        />
      </div>
    );
  }
}

export default BankMain;
