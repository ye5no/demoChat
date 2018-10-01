import Auth from './Auth.jsx';
import History from './History.jsx';
import Message from './Message.jsx';
import Chaters from './Chaters.jsx';
import server from '../server-interface.js';

import './App.less';

class App extends window.React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false,
	    chat: 'all',
	    socket: window.io({path: '/api/ws'}),
    };
    this.changeUser = this.changeUser.bind(this);
	  this.changeChat = this.changeChat.bind(this);
  }

	changeUser(newData) {
		this.setState({user : newData});
	}

	changeChat(newData) {
		this.setState({chat : newData});
	}

  render() {
    return (
      <div className="App-mainContainer" align="center">
        <div className="App-content">

	        <h1 className="App-header">Demo chat</h1>

	        <div className="row">
            <div className="col-xs-12 col-md-4">
              <Auth state={this.state} onChange={this.changeUser}/>
	            <Chaters state={this.state} onChange={this.changeChat}/>
            </div>
            <div className="col-xs-12 visible-xs visible-sm">
              <hr size="2" />
            </div>
            <div className="col-xs-12 col-md-8">
              <History state={this.state} />
            </div>
          </div>

	        <Message state={this.state} />
        </div>
      </div>
    );
  }
}

export default App;
