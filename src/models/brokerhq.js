/* eslint-disable no-undef */
import '../config';

const Stomp = require('stompjs');


export default {
  namespace: 'brokerhq',
  state: {
    tradeprice: null,
  },
  reducers: {
    updateTradeprice(state, { payload: tradeprice }) {
      return { ...state, tradeprice };
    },
  },
  effects: {},
  subscriptions: {
    openSocket({ dispatch }) {
      const ws = new WebSocket(global.constants.rabbimqws);
      const client = Stomp.over(ws);
      client.heartbeat.incoming = 0;
      client.connect('bond', 'bond', () => {
        client.subscribe('/exchange/BROKERTRADE/', (d) => {
          const tradeprice = JSON.parse(d.body);
          dispatch({
            type: 'updateTradeprice',
            payload: tradeprice,
          });
        }, { 'auto-delete': true });
      }, (evt) => {
        console.log(`error: ${evt}`);
      }, '/');
    },
  },
};
