/**
 * Created by Lenovo on 2020/1/8.
 */
/* eslint-disable no-undef */
import moment from 'moment';
import '../config';

const Stomp = require('stompjs');


export default {
  namespace: 'brokerQuote',
  state: {
    quoteprice: null,
    bcData: null,
    dataTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
  },
  reducers: {
    updateQuoteprice(state, { payload: quoteprice }) {
      return { ...state, quoteprice, dataTime: moment().format('MMMM Do YYYY, h:mm:ss a') };
    },
    updateBC(state, { payload: bcData }) {
      return { ...state, bcData };
    },
    freshBC(state, { payload: quoteprice }) {
      try {
        let isUpdate = false;
        const oldQuote = state.bcData;
        if (oldQuote !== null) {
          const newQuote = quoteprice;
          let code = newQuote.BondCode;
          code = code.substr(0, code.length - 3);
          const finalQuote = oldQuote.map((old) => {
            if (old.bond === code) {
              const bid = Number(newQuote.Bid);
              const ofr = Number(newQuote.Ofr);
              let tempQuote = old;
              if (!isNaN(bid)) {
                const bcbid = (bid + (Number(old.bidspread) / 100)).toFixed(4);
                tempQuote = { ...old, bid, bcbid };
              }
              if (!isNaN(ofr)) {
                const bcofr = (ofr - (Number(old.ofrspread) / 100)).toFixed(4);
                tempQuote = { ...old, ofr, bcofr };
              }
              isUpdate = true;
              return tempQuote;
            } else {
              return old;
            }
          });
          if (isUpdate) {
            return { ...state, bcData: finalQuote };
          } else {
            return state;
          }
        } else {
          return state;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  subscriptions: {
    openQuoteSocket({ dispatch }) {
      const ws = new WebSocket(global.constants.rabbimqws);
      const client = Stomp.over(ws);
      client.heartbeat.incoming = 0;
      client.connect('bond', 'bond', () => {
        client.subscribe('/exchange/BROKERQUOTE/', (d) => {
          const quoteprice = JSON.parse(d.body);
          dispatch({
            type: 'updateQuoteprice',
            payload: quoteprice,
          });
          dispatch({
            type: 'freshBC',
            payload: quoteprice,
          });
        }, { 'auto-delete': true });
      }, (evt) => {
        console.log(`error: ${evt}`);
      }, '/');
    },
  },
};
