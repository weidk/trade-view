import React from 'react';
import moment from 'moment';
import { Divider } from 'antd';
import fetch from 'dva/fetch';
import styles from './InstituteRank.css';
import MyDatePicker from '../MyDatePicker';
import InstituteRankChart from './InstituteRankChart';
import InstitutePropsModal from './InstitutePropsModal';
import InsTsChart from './InsTsChart';

const defaultRange = [moment('1..1', 'DDD DDDD'), moment()];

class InstituteRank extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      interestdata: [],
      creditdata: [],
      visible: false,
      visible1: false,
      visible2: false,
      name: '',
      start: '',
      end: '',
      modaldata: [],
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
      fetch('/api/instituterankall', {
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

      fetch('/api/instituterankinterest', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ interestdata: ds });
        });
      });

      fetch('/api/instituterankcredit', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ creditdata: ds });
        });
      });
    } catch (error) {
      console.log('error: ', error);
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
  showModal = (ev) => {
    try {
      const tradername = ev.data._origin.USERNAME;
      fetch('/api/instituteprops', {
        method: 'POST',
        body: JSON.stringify({ start: this.state.start, end: this.state.end, name: tradername }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ modaldata: ds, name: tradername });
        });
      });

      this.setState({
        visible: true,
      });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  showInterestTsModal = (ev) => {
    try {
      const tradername = ev.data._origin.USERNAME;
      fetch('/api/inssaleallocateamtinterest', {
        method: 'POST',
        body: JSON.stringify({ name: tradername }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ visible1: true, modaldata: ds, name: tradername });
        });
      });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  showCreditTsModal = (ev) => {
    try {
      const tradername = ev.data._origin.USERNAME;
      fetch('/api/inssaleallocateamtcredit', {
        method: 'POST',
        body: JSON.stringify({ name: tradername }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ visible2: true, modaldata: ds, name: tradername });
        });
      });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <MyDatePicker title="选择区间：" termRange={defaultRange} onChangeHandle={this.pickerChange} />
        <InstituteRankChart barData={this.state.chartdata} title="机构认购排名——全品种" doubleClickHandle={this.showModal} />
        <Divider />
        <InstituteRankChart barData={this.state.interestdata} title="机构认购排名——利率" doubleClickHandle={this.showInterestTsModal} />
        <Divider />
        <InstituteRankChart barData={this.state.creditdata} title="机构认购排名——信用" doubleClickHandle={this.showCreditTsModal} />
        <InstitutePropsModal
          title={`${this.state.name}·属性图   （${this.state.start} ~ ${this.state.end}）`}
          data={this.state.modaldata}
          visible={this.state.visible}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
        <InsTsChart
          title={`${this.state.name} 利率认购额走势`}
          data={this.state.modaldata}
          visible={this.state.visible1}
          handleOk={() => {
            this.setState({
              visible1: false,
            });
          }}
          handleCancel={() => {
            this.setState({
              visible1: false,
            });
          }}
        />

        <InsTsChart
          title={`${this.state.name} 信用认购额走势`}
          data={this.state.modaldata}
          visible={this.state.visible2}
          handleOk={() => {
            this.setState({
              visible2: false,
            });
          }}
          handleCancel={() => {
            this.setState({
              visible2: false,
            });
          }}
        />
      </div>
    );
  }
}

export default InstituteRank;
