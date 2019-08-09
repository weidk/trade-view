import React from 'react';
import { Chart, Tooltip, Axis, Geom } from 'bizcharts';
import { Divider, Radio } from 'antd';
import fetch from 'dva/fetch';
import styles from './XBondCounterMain.css';

let ins = '昆山农村商行';

class XBondCounterMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.GetData(ins);
  }

  GetData = (insname) => {
    try {
      fetch('/api/xbondcounter', {
        method: 'POST',
        body: JSON.stringify(
          { insname,
          }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState(
            { chartdata: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange = (value) => {
    try {
      ins = value.target.value;
      this.GetData(ins);
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    return (
      <div>
        <a>选择查询区间 ：</a>
        <Radio.Group defaultValue="昆山农村商行" buttonStyle="solid" onChange={this.handleChange}>
          <Radio.Button value="昆山农村商行">昆山农商行</Radio.Button>
          <Radio.Button value="农业银行">农业银行</Radio.Button>
          <Radio.Button value="国泰君安证券">国泰君安</Radio.Button>
          <Radio.Button value="浙商证券股份有限公司">浙商证券</Radio.Button>
          <Radio.Button value="山西证券">山西证券</Radio.Button>
          <Radio.Button value="平安银行">平安银行</Radio.Button>
          <Radio.Button value="东方证券">东方证券</Radio.Button>
          <Radio.Button value="银行主力">银行主力</Radio.Button>
          <Radio.Button value="券商主力">券商主力</Radio.Button>
        </Radio.Group>
        <h3 className={styles.normal}>累计净买入量</h3>
        <Chart height={400} data={this.state.chartdata} forceFit padding="auto">
          <Axis name="TRADEDATE" />
          <Axis
            name="SUMFACEVALUE" label={{
              formatter: (val) => {
                return `${val}亿`;
              },
            }}
          />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom
            type="interval"
            position="TRADEDATE*SUMFACEVALUE"
            size={2}
            shape={'hv'}
            color={['SUMFACEVALUE', (cut) => {
              if (cut < 0) { return '#53ab53'; } else { return '#ec6663'; }
            }]}
          />
        </Chart>
        <Divider />
        <h3 className={styles.normal}>累计净买入笔数</h3>
        <Chart height={400} data={this.state.chartdata} forceFit padding="auto">
          <Axis name="TRADEDATE" />
          <Axis
            name="SUMDEALS" label={{
              formatter: (val) => {
                return `${val}笔`;
              },
            }}
          />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom
            type="interval"
            position="TRADEDATE*SUMDEALS"
            size={2}
            shape={'hv'}
            color={['SUMDEALS', (cut) => {
              if (cut < 0) { return '#53ab53'; } else { return '#ec6663'; }
            }]}
          />
        </Chart>
      </div>
    );
  }
}

export default XBondCounterMain;
