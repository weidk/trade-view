import React from 'react';
import { Modal } from 'antd';
import { Chart, Geom, Tooltip, Coord, Axis } from 'bizcharts';
import DealTsBarNew from './DealTsBarNew';
import styles from './DealBarNew.css';


class DealBarNew extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      x: '',
    };
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
    this.setState({
      visible: true,
      x: ev.data._origin.InsType, /* eslint no-underscore-dangle: 0 */
    });
  }
  render() {
    const scale = {
      Amt: {
        tickCount: 3,
      },
    };
    const DealTs = (<DealTsBarNew
      ins={this.state.x}
      term={this.props.bondterm}
      type={this.props.bondtype}
    />);
    return (
      <div className={styles.normal}>
        <h3>{this.props.title}</h3>
        <Chart height="500" data={this.props.data} forceFit padding="auto" scale={scale} onPlotDblClick={ev => this.showModal(ev)} >
          <Coord transpose />
          <Axis name="InsType" label={{ offset: 12 }} />
          <Axis name="Amt" />
          <Tooltip />
          {this.props.selectedIns === 'all' ? <Geom type="interval" position="InsType*Amt" color={this.props.color} />
            : <Geom
              type="interval" position="InsType*Amt" color={['InsType*Amt', (InsType, Amt) => {
                if (InsType === this.props.selectedIns) {
                  if (Amt > 0) { return '#FF0000'; } else { return '#008B00'; }
                } else { return '#DCDCDC'; }
              }]}
            />}
        </Chart>
        <Modal
          title={`${this.state.x}-${this.props.title}-${this.props.bondtype} 现券交易时序图`}
          visible={this.state.visible}
          width="88vw"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose="true"
        >
          {DealTs}
        </Modal>
      </div>
    );
  }
}

export default DealBarNew;
