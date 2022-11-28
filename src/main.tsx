import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import 'react-quill/dist/quill.snow.css';
import './styles/index.less';
import store from './stores';
import { Provider } from 'react-redux';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
