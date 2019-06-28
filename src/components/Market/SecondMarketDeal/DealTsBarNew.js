import React from 'react';
import fetch from 'dva/fetch';
import { Chart, Geom, Tooltip, Axis, Legend } from 'bizcharts';
import { Button, Row, Col } from 'antd';
import styles from './DealTsBar.css';

const ExportJsonExcel = require('js-export-excel');

class DealTsBarNew extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.fetchData(this.props.ins, this.props.type, this.props.term);
  }

  fetchData = (insdata, typedata, termdata) => {
    try {
      fetch('/api/marketdealtsnew', {
        method: 'POST',
        body: JSON.stringify({ ins: insdata, type: typedata, term: termdata }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  writeToExcel = () => {
    const option = {};
    option.fileName = `${this.props.ins}_${this.props.type}_${this.props.term}数据`;
    option.datas = [
      {
        sheetData: this.state.chartdata,
        sheetHeader: ['日期', '累计值', '同比值', 'MA5-MA20'],
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }


  render() {
    const data = this.state.chartdata;
    return (
      <div className={styles.normal}>
        <Chart height={400} data={data} forceFit padding="auto">
          <Axis name="date" />
          <Axis
            name="type" label={{
              formatter: (val) => {
                return `${val}亿`;
              },
            }}
          />
          <Axis name="tongbi" visible={false} />
          <Axis name="MA5-MA20" position="right" />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom
            type="interval"
            position="date*type"
            size={2}
            shape={'hv'}
            // color={['type', (cut) => {
            //   if (cut < 0) { return '#53ab53'; } else { return '#ec6663'; }
            // }]}
            color="#53ab53"
          />
          <Legend />

          <Geom
            type="line"
            position="date*tongbi"
            size={3}
            color="#FFA500"
          />
          <Geom
            type="line"
            position="date*MA5-MA20"
            size={3}
            color="#ec6663"
          />
        </Chart>
        <Row><Col span={2} offset={22}><Button type="primary" onClick={() => this.writeToExcel()}>导出excel</Button></Col></Row>
      </div>
    );
  }
}

export default DealTsBarNew;
