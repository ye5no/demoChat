import server from '../server-interface.js';
const socket = window.io({path: '/api/ws'});

class Message extends window.React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	message: '',
      chat: props.state.chat,
	    user: props.state.user,
    };
	  this.changeInputData = this.changeInputData.bind(this);
    this.sendMessageToServer = this.sendMessageToServer.bind(this);
  }

	componentWillReceiveProps(nextProps){
		if (this.state.chat !== nextProps.state.chat) {
			this.setState({ message: '', chat: nextProps.state.chat });
		}
		if (this.state.user !== nextProps.state.user) {
			this.setState({ chat: 'all', user: nextProps.state.user});
		}
	};

  changeInputData(val) {
  	this.setState({ message: val });
  }

	sendMessageToServer() {
  	if (this.state.message) {
		  const send = {
			  message: this.state.message,
			  from: this.state.user,
			  to: this.state.chat,
		  };
		  server.action.sendMessage(send, () => {
			  this.setState({ message: '' });
		  });
	  }
  }

  render() {
  	if (this.state.user) {
		  return (
			  <div className="row" style={{marginTop: '1em'}}>
				  <div className="col-xs-12">
					  <div className="input-group">
						  <input type="text" className="form-control"
						         onChange={e => this.changeInputData(e.target.value)}
						         value={this.state.message}
						         onKeyUp={e => {
							         if (e.key === 'Enter') this.sendMessageToServer()
						         }}/>
						  <span className="input-group-btn">
				        <button className="btn btn-default" type="button" onClick={this.sendMessageToServer}>Go!</button>
				      </span>
					  </div>
				  </div>
			  </div>
		  )
	  } else {
  		return (<div></div>)
	  }
  }
}

export default Message;
