import React from 'react';
import moment from 'moment';
import { Divider } from 'antd';
import fetch from 'dva/fetch';
import styles from './TraderRank.css';
import MyDatePicker from '../MyDatePicker';
import TraderRankChart from './TraderRankChart';
import TraderPropsModal from './TraderPropsModal';
import TraderTsChart from './TraderTsChart';

const defaultRange = [moment('1..1', 'DDD DDDD'), moment()];

class TraderRank extends React.Component {
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
      fetch('/api/traderrankall', {
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

      fetch('/api/traderrankinterest', {
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

      fetch('/api/traderrankcredit', {
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
      fetch('/api/traderprops', {
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
      fetch('/api/tradersaleallocateamtinterest', {
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
      fetch('/api/tradersaleallocateamtcredit', {
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
        <TraderRankChart barData={this.state.chartdata} title="交易员销售排名——全品种" doubleClickHandle={this.showModal} />
        <Divider />
        <TraderRankChart barData={this.state.interestdata} title="交易员销售排名——利率" doubleClickHandle={this.showInterestTsModal} />
        <Divider />
        <TraderRankChart barData={this.state.creditdata} title="交易员销售排名——信用" doubleClickHandle={this.showCreditTsModal} />
        <TraderPropsModal
          title={`${this.state.name}·属性图   （${this.state.start} ~ ${this.state.end}）`}
          data={this.state.modaldata}
          visible={this.state.visible}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
        <TraderTsChart
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

        <TraderTsChart
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

export default TraderRank;
