import React from 'react';
import { Row, Col, Divider } from 'antd';
import { Chart, Geom, Axis, Tooltip, Label } from 'bizcharts';
import DataSet from '@antv/data-set';
import numeral from 'numeral';
import styles from './FutureDeposit.css';


class FutureDeposit extends React.Component {
  render() {
    const ds = new DataSet();
    const dv = ds.createView().source(this.props.O32Json);
    dv.transform({
      type: 'fold',
      fields: ['enabledeposit', 'occupydeposit'],
      // 展开字段集
      key: '使用情况',
      // key字段
      value: '保证金金额', // value字段
    });

    const ds2 = new DataSet();
    const dv2 = ds2.createView().source(this.props.sumData);
    dv2.transform({
      type: 'fold',
      fields: ['enabledeposit', 'occupydeposit'],
      // 展开字段集
      key: '使用情况',
      // key字段
      value: '保证金金额', // value字段
    });

    return (
      <div className={styles.normal}>
        <Divider> 国债期货保证金占用率 </Divider>
        <Row>
          <Col span={4} >
            <Chart
              height={400}
              data={dv2}
              forceFit
              padding="77"
            >
              {/* <Legend clickable={false} />*/}
              <Axis
                name="保证金金额"
                label={{
                  formatter: (val) => {
                    return `${val}万`;
                  },
                }}
              />
              <Axis name="assetname" />
              <Tooltip />
              <Geom
                type="intervalStack"
                position="assetname*保证金金额"
                color={[['使用情况', 'occupyrate'], (cut, r) => {
                  // some code
                  if (cut === 'enabledeposit') { return '#4ecb73'; } else if (r > 0.7) {
                    return '#EE6363';
                  } else {
                    return '#8c8c8c';
                  }
                }]}
                // color="使用情况"
              >
                <Label
                  content={[
                    'occupyrate',
                    (value) => {
                    // 用于格式化 最终显示的 label
                      return numeral(value).format('0.00%');
                    }]}
                  formatter={(text, item) => {
                    // 仅显示 最上面一组的 label 达成总数显示需求
                    if (item._origin.使用情况 === 'occupydeposit') {
                      return null;
                    }
                    return text;
                  }}
                />
              </Geom>
            </Chart>
          </Col>
          <Col span={20}>
            <Chart
              height={400}
              data={dv}
              forceFit
              padding="77"
            >
              {/* <Legend clickable={false} />*/}
              <Axis
                name="保证金金额"
                label={{
                  formatter: (val) => {
                    return `${val}万`;
                  },
                }}
              />
              <Axis name="assetname" />
              <Tooltip />
              <Geom
                type="intervalStack"
                position="assetname*保证金金额"
                color={[['使用情况', 'occupyrate'], (cut, r) => {
                  // some code
                  if (cut === 'enabledeposit') { return '#4ecb73'; } else if (r > 0.7) {
                    return '#EE6363';
                  } else {
                    return '#8c8c8c';
                  }
                }]}
                // color="使用情况"
              >
                <Label
                  content={[
                    'occupyrate',
                    (value) => {
                    // 用于格式化 最终显示的 label
                      return numeral(value).format('0.00%');
                    }]}
                  formatter={(text, item) => {
                    // 仅显示 最上面一组的 label 达成总数显示需求
                    if (item._origin.使用情况 === 'occupydeposit') {
                      return null;
                    }
                    return text;
                  }}
                />
              </Geom>
            </Chart>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FutureDeposit;
