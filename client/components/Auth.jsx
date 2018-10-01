import Button from './Buttons.jsx';
import server from '../server-interface.js';
import './Auth.less';

function getCookie(name) {
	const matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

class Auth extends window.React.Component {
  constructor(props) {
    super(props);
    this.username = '';
    this.password = '';
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
	  this.vk = this.vk.bind(this);
    this.logOut = this.logOut.bind(this);
    this.getUser = this.getUser.bind(this);
    if (getCookie('user')) this.getUser();
  }

  logIn() {
    if (this.username && this.password)
      server.auth.logIn({username: this.username, password: this.password}, this.getUser);
  }

  signUp() {
    if (this.username && this.password)
      server.auth.signUp({username: this.username, password: this.password}, this.getUser);
  }

	vk() {
		server.auth.vk(this.getUser);
	}

  logOut() {
	  this.props.state.socket.emit('logout', this.props.state.user);
    server.auth.logOut(() => {
      this.props.onChange(undefined);
    });
  }

  getUser() {
    server.auth.getUser((username) => {
	    this.props.state.socket.emit('login', username);
      this.props.onChange(username);
    });
  }

  tabToggle(event) {
    event.preventDefault();
    window.$(event.target).tab('show');
  }

  render() {
    const setLogin = (e) => {
      this.username = e.target.value.trim();
    };
    const setPassword = (e) => {
      this.password = e.target.value.trim();
    };

    if (this.props.state.user) {
      return(
        <div className="Auth-panel" align="left">
          <p>Username: {this.props.state.user}<Button.logOut onClick={this.logOut}/></p>
        </div>
      )
    } else {
    	const fields =
		    <div>
			    <input type="username" className="form-control Auth-fields" placeholder="username" onChange={setLogin}/>
			    <input type="password" className="form-control Auth-fields" placeholder="password" onChange={setPassword}/>
		    </div>;
      return(
        <div>
          <ul className="nav nav-tabs" id="navTab">
            <li className="active"><a href="#authin" onClick={this.tabToggle}>Login</a></li>
            <li><a href="#authup" onClick={this.tabToggle}>Signup</a></li>
	          <li><a href="#vk" onClick={this.tabToggle}>VK</a></li>
          </ul>
          <div className="Auth-panel Auth-panel-signOut">
            <div className="tab-content">
              <div className="tab-pane active" id="authin">
	              {fields}
                <Button.logIn onClick={this.logIn}/>
              </div>
              <div className="tab-pane" id="authup">
	              {fields}
                <Button.signUp onClick={this.signUp}/>
              </div>
	            <div className="tab-pane" id="vk">
		            <Button.vk onClick={this.vk}/>
	            </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Auth;
