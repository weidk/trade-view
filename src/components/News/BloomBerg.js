/* eslint-disable no-undef */
import React from 'react';
import { List, Tag, message, Alert } from 'antd';
import fetch from 'dva/fetch';
import '../../config';
import styles from './BloomBerg.css';


const Stomp = require('stompjs');

const NotificationInstance = Notification || window.Notification;
let client = null;
let news = [];
class BloomBerg extends React.Component {
  constructor() {
    super();
    this.state = {
      newslist: [],
    };
  }

  componentDidMount() {
    if (NotificationInstance) {
      const permissionNow = NotificationInstance.permission;
      if (permissionNow === 'granted') { // 允许通知
        console.log('开始推送');
      } else if (permissionNow === 'denied') {
        console.log('用户拒绝了你!!!');
        this.setPermission();
      } else {
        this.setPermission();
      }
    }
    try {
      fetch('/api/bloomenews', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          news = ds;
          this.setState({ newslist: ds });
        });
      });
    } catch (error) {
      console.log(error);
    }
    // const ws = new WebSocket('ws://192.168.87.103:15674/ws');
    const ws = new WebSocket(global.constants.rabbimqws);
    client = Stomp.over(ws);
    client.heartbeat.incoming = 0;
    client.connect('bond', 'bond', this.onOpenHandle, this.onErrorHandle, '/');
  }

  onOpenHandle = () => {
    console.log('Connection open ...');
    client.subscribe('/exchange/bloombergnews/', (d) => {
      news.unshift(JSON.parse(d.body)[0]);
      // eslint-disable-next-line no-new
      new Notification('Bloombergnews', { body: news[0].newsinfo });
      message.success(news[0].newsinfo, 10);
      // notification.open({
      //   message: news[0].newsinfo,
      //   icon: <Icon type="bell" style={{ color: '#FF6A6A' }} />,
      //   placement: 'bottomRight',
      //   duration: 9,
      // });
      this.setState({ newslist: news });
    }, {
      'auto-delete': true,
    });
  }

  onErrorHandle = (evt) => {
    console.log(`error: ${evt}`);
  }

  setPermission =() => {
    // 请求获取通知权限
    NotificationInstance.requestPermission((PERMISSION) => {
      if (PERMISSION === 'granted') {
        console.log('获取权限');
      } else {
        console.log('用户无情残忍的拒绝了你!!!');
      }
    });
  }


  render() {
    return (
      <div className={styles.normal}>
        <Alert message="新闻实时推送，请勿关闭页面~" type="success" showIcon />
        <List
          size="large"
          bordered
          split={false}
          dataSource={this.state.newslist}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                description={<h3>{item.newsinfo}</h3>}
              />
              <div><Tag>{item.newstime}</Tag></div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default BloomBerg;
