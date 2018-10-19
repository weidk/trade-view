import React from 'react';
import { message, Tabs } from 'antd';
import { Segment } from 'semantic-ui-react';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import MMHQ from './MMHQ';
import Orders from './Orders';
import Deals from './Deals';
import styles from './MMMain.css';

const TabPane = Tabs.TabPane;

class MMMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotedata: [],
      hubConnection: null,
      orderdata: [],
      dealdata: [],
    };
  }
  componentDidMount = () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl('/marketmakerapi/quote/')
      .configureLogging(LogLevel.Information)
      .build();

    this.setState({ hubConnection }, () => {
      this.state.hubConnection.start()
        .then(() => {
          this.state.hubConnection.on('NewQuotes',
            (receiveJson) => {
              this.setState({ quotedata: receiveJson });
            });
          this.state.hubConnection.on('OrderResult',
            (receiveJson) => {
              if (receiveJson.indexOf('成功') >= 0) {
                message.success(receiveJson);
              } else {
                message.error(receiveJson);
              }
            });
          this.state.hubConnection.on('Orders',
            (receiveJson) => {
              this.setState({ orderdata: receiveJson });
            });
          this.state.hubConnection.on('Deals',
            (receiveJson) => {
              console.log(receiveJson);
              this.setState({ dealdata: receiveJson });
            });
        })
        .catch(err => console.error(err.toString()));
    });
  };
  sendNewOrder = (values) => {
    this.state.hubConnection.invoke('SendNewOrder', values).catch((err) => {
      return console.error(err.toString());
    });
  };

  CancleOrder = (values) => {
    this.state.hubConnection.invoke('CancleOrder', values).catch((err) => {
      return console.error(err.toString());
    });
  };

  render() {
    return (
      <div className={styles.normal}>
        <Segment color="green">
          <MMHQ data={this.state.quotedata} send={this.sendNewOrder} />
        </Segment>
        <Segment color="green">
          <Tabs defaultActiveKey="1">
            <TabPane tab="委托" key="1"><Orders data={this.state.orderdata} onCancle={this.CancleOrder} /></TabPane>
            <TabPane tab="成交" key="2"><Deals data={this.state.dealdata} /></TabPane>
            <TabPane tab="统计" key="3">统计。。。</TabPane>
          </Tabs> </Segment>
      </div>
    );
  }
}

export default MMMain;
