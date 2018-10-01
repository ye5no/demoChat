import App from './components/App.jsx';

const renderApp = (Component) => {
  window.ReactDOM.render(<Component />, document.getElementById('content'));
};

renderApp(App);
