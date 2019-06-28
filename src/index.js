import dva from 'dva';
// import createHistory from 'history/createBrowserHistory';
import 'semantic-ui-css/semantic.min.css';
// import { message } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import router from './router';

// import example from './models/example';

// const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
// const app = dva({
//   history: createHistory(),
//   onError(e) {
//     message.error(e.message, ERROR_MSG_DURATION);
//   },
// });

// 1. Initialize
const app = dva();

// app.model(quotes);

// 2. Plugins
// app.use(createLoading());

// 3. Model
// app.model(example);

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
