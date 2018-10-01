import server from '../server-interface.js';
import './History.less';

function getChannel(chat, user) {
	return (chat === 'all' || !user) ? 'all' : user < chat ? user+'-'+chat : chat+'-'+user;
}

class History extends window.React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	history: [],
	    chat: props.state.chat,
	    user: props.state.user,
	    channel: getChannel(props.state.chat, props.state.user),
    };
	  this.addMessage = this.addMessage.bind(this);
	  this.getHistoryFromServer = this.getHistoryFromServer.bind(this);
	  this.getHistoryFromServer();
  }

	componentWillReceiveProps(nextProps){
  	this.props.state.socket.removeListener(this.state.channel, this.addMessage);
  	const newState = this.state;
		if (!nextProps.state.user) {
			newState.user = undefined;
			newState.chat = 'all';
		} else {
			newState.user = nextProps.state.user;
			newState.chat = nextProps.state.chat;
		}
		newState.channel = getChannel(newState.chat, newState.user);
		newState.history = [];
		this.props.state.socket.on(newState.channel, this.addMessage);
		this.setState(newState, this.getHistoryFromServer);
	};

	getHistoryFromServer() {
    server.action.getHistory({ chat: this.state.chat }, (resp) => {
      this.setState({ history: JSON.parse(resp) });
      historyContainer.scrollTop = historyContainer.scrollHeight;
    });
  }

	addMessage(data) {
		const history = this.state.history;
		history.push(JSON.parse(data));
		this.setState({ history });
		historyContainer.scrollTop = historyContainer.scrollHeight;
	}

  render() {
	  const divs = this.state.history.map((data, indexRow) =>
		  <div align="left" key={indexRow+1}>{data.from}:{data.message}</div>
	  );
    return (
      <div className="History-mainContainer" id="historyContainer">{divs}</div>
    )
  }
}

export default History;
