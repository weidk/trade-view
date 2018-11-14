import React from 'react';
import { connect } from 'dva';
import { Container, Divider, Card } from 'semantic-ui-react';
import { Input, Icon, message } from 'antd';
import MainMenu from '../Layout/MainMenu';
import MainContent from '../Layout/MainContent';
// import styles from './IndexPage.css';

const Search = Input.Search;

class IndexPage extends React.Component {
  render() {
    return (
      <MainMenu location={this.props.location}>
        <MainContent>
          <Container style={{ marginTop: '7em' }} >
            <Divider horizontal >
              <Card>
                <Card.Content>
                  <Card.Header>登录</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Search
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password" placeholder="回车确认登录"
                      onSearch={(value) => {
                        const storage = window.localStorage;
                        if (value === 'donghai888') {
                          storage.setItem('login', true);
                          message.success('登录成功');
                        } else if (value === 'trade123') {
                          storage.setItem('login1', true);
                          message.success('登录成功');
                        } else {
                          message.error('登录密码错误');
                        }
                      }}
                    />
                  </div>
                </Card.Content>
              </Card>
              {/* <Segment>*/}
              {/* <a href="http://172.18.3.33" target="view_window">*/}
              {/* <Button >*/}
              {/* CRM*/}
              {/* </Button>*/}
              {/* </a>*/}
              {/* <a href="http://172.18.3.41:7799" target="view_window">*/}
              {/* <Button >*/}
              {/* BPM*/}
              {/* </Button>*/}
              {/* </a>*/}
              {/* <a href="http://172.18.3.33/teamwork" target="view_window">*/}
              {/* <Button >*/}
              {/* 协同*/}
              {/* </Button>*/}
              {/* </a>*/}
              {/* </Segment>*/}
            </Divider>
          </Container>
        </MainContent>
      </MainMenu>
    );
  }
}
IndexPage.propTypes = {
};

export default connect()(IndexPage);
