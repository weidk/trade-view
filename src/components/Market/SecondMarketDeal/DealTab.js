import React from 'react';
import { Tabs, Radio, Affix } from 'antd';
import DealMain from './DealMain';
import DealMainNew from './DealMainNew';
import styles from './DealTab.css';

const TabPane = Tabs.TabPane;

class DealTab extends React.Component {
  constructor() {
    super();
    this.state = {
      radioValue: 'all',
    };
  }
  onChangeHandle = (e) => {
    this.setState({
      radioValue: e.target.value,
    });
  };
  render() {
    const operations =
      (<Affix offsetTop="10">
        <Radio.Group defaultValue="all" size="small" onChange={this.onChangeHandle}>
          <Radio.Button value="all">全选</Radio.Button>
          <Radio.Button value="大型商业银行/政策性银行">大行</Radio.Button>
          <Radio.Button value="股份制商业银行">股份</Radio.Button>
          <Radio.Button value="城市商业银行">城商</Radio.Button>
          <Radio.Button value="农村金融机构">农商</Radio.Button>
          <Radio.Button value="外资银行">外资</Radio.Button>
          <Radio.Button value="证券公司">券商</Radio.Button>
          <Radio.Button value="基金公司及产品">基金</Radio.Button>
          <Radio.Button value="保险公司">保险</Radio.Button>
          <Radio.Button value="境外机构">境外</Radio.Button>
        </Radio.Group>
      </Affix>);
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="1" tabPosition="top" tabBarExtraContent={operations}>
          <TabPane tab="New" key="1" ><DealMainNew selectedIns={this.state.radioValue} /></TabPane>
          <TabPane tab="Old" key="2" ><DealMain /></TabPane>
        </Tabs>
      </div>
    );
  }
}

export default DealTab;
