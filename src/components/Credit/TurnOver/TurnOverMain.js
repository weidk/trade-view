import React from 'react';
import fetch from 'dva/fetch';
import { DatePicker } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import moment from 'moment';
import styles from './TurnOverMain.css';

class TurnOverMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange(moment().subtract(100, 'days'));
  }

 pickerChange = (values) => {
   try {
     fetch('/api/creditturnoverrate', {
       method: 'POST',
       body: JSON.stringify(values.format('YYYYMMDD')),
       headers: {
         'Content-Type': 'application/json',
       },
     }).then((response) => {
       response.json().then((ds) => {
         this.setState({ chartdata: ds });
         console.log(ds);
       });
     });
   } catch (error) {
     // console.log('error: ', error);
   }
 }

 render() {
   return (
     <div className={styles.normal}>
       <a>请选择查询的起始日期：</a>
       <DatePicker onChange={this.pickerChange} defaultValue={moment().subtract(100, 'days')} />
       <Chart weight={window.innerWidth} data={this.state.chartdata} padding="auto" forceFit>
         <Tooltip crosshairs />
         <Axis
           name="TurnoverRate"
         />
         <Legend />
         <Geom type="line" position="tradedate*TurnoverRate" color="rate" shape={'smooth'} />
       </Chart>
     </div>
   );
 }
}

export default TurnOverMain;
