import server from '../server-interface.js';
import {onlineUsers} from "../../server/sockets";

import './Chaters.less';

class Chaters extends window.React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	user: props.state.user,
	    chaters: [],
    };
    this.getChaters = this.getChaters.bind(this);
	  this.addChater = this.addChater.bind(this);
	  this.delChater = this.delChater.bind(this);
	  this.choiseChater = this.choiseChater.bind(this);
	  this.props.state.socket.on('login', this.addChater);
	  this.props.state.socket.on('logout', this.delChater);
	  this.getChaters();
  }

	componentWillReceiveProps(nextProps){
		if (nextProps.state.user !== this.state.user) {
			this.setState({ user: nextProps.state.user }, this.getChaters);
		}
	};

  getChaters() {
	  server.action.getOnlines(data => {
		  const chaters = JSON.parse(data);
      this.setState({ chaters });
	  });
  }

  addChater(username) {
	  const chaters = this.state.chaters;
	  const index = chaters.findIndex(c => c.username === username);
	  chaters[index].status = 'online';
	  this.setState({ chaters });
  }

	delChater(username) {
		const chaters = this.state.chaters;
		const index = chaters.findIndex(c => c.username === username);
		chaters[index].status = 'offline';
		this.setState({ chaters });
	}

	choiseChater(target) {
  	if (this.state.user) {
		  const prev = document.getElementsByClassName("Chaters-choiceString");
		  if (prev.length > 0) prev[0].className = 'Chaters-string';
		  target.className = "Chaters-choiceString";
		  const chat = target.innerHTML.replace('***', '');
		  this.props.onChange(chat);
	  }
	}

  render() {
  	const divs = [];
	  this.state.chaters.forEach((data, indexRow) => {
				if (indexRow === 0) divs.push(
					<div className="Chaters-choiceString" key={'chater-0'} onClick={e => this.choiseChater(e.target)}>all</div>
				);
				const inner = (this.state.user && data.status === 'online') ? '***'+data.username : data.username;
			  divs.push(
				  <div className="Chaters-string" key={'chater-' + indexRow + 1}
				       onClick={e => this.choiseChater(e.target)}>{inner}</div>
			  )
		  }
	  );
	  return (
		  <div className="Chaters-mainContainer">{divs}</div>
	  )
  }
}

export default Chaters;
