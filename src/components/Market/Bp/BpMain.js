import React from 'react';
import { Row, Col } from 'antd';
import { firstBy } from 'thenby';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import styles from './BpMain.css';
import ChangeBar from './ChangeBar';

const R = require('ramda');

class BpMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tenYear: [],
      fiveYear: [],
      oneYear: [],
      hubConnection: null,
    };
  }
  componentDidMount = () => {
    const hubConnection = new HubConnectionBuilder()
      // .withUrl('http://127.0.0.1:5000/signalrapi/bpchange/')
      .withUrl('/signalrapi/bpchange/')
      .configureLogging(LogLevel.Information)
      .build();

    this.setState({ hubConnection }, () => {
      this.state.hubConnection.start()
        .then(() => {
          this.state.hubConnection.on('ReceiveBp',
            (receiveJson) => {
              // const myDate = new Date();
              // console.log(myDate.getTime());
              // console.log(receiveJson);
              receiveJson.sort(firstBy('type', -1)
                .thenBy('bp', -1),
              );
              const tenYear = this.groupData(receiveJson, '10y');
              const fiveYear = this.groupData(receiveJson, '5-7y');
              const oneYear = this.groupData(receiveJson, '1-3y');
              this.setState({ tenYear, fiveYear, oneYear });
            });
        })
        .catch(err => console.error(err.toString()));
    });
  }


  groupData = (data, term) => {
    const filtered = R.filter(d => d.term === term)(data);
    return filtered;
  }

  render() {
    return (
      <div className={styles.normal}>
        <Row gutter={24}>
          <Col span={8}><ChangeBar title="10年" barData={this.state.tenYear} ax1="code" ax2="bp" /></Col>
          <Col span={8}><ChangeBar title="5-7年" barData={this.state.fiveYear} ax1="code" ax2="bp" /></Col>
          <Col span={8}><ChangeBar title="1-3年" barData={this.state.oneYear} ax1="code" ax2="bp" /></Col>
        </Row>
      </div>
    );
  }
}

export default BpMain;
