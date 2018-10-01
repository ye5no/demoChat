import './Buttons.less';

export default {
  signUp: (props) => {
    return(
      <button className="btn btn-default" onClick={props.onClick}>Signup</button>
    );
  },
  logIn: (props) => {
    return (
      <button className="btn btn-default" onClick={props.onClick}>Login</button>
    )
  },
  logOut: (props) => {
    return (
      <button className="btn btn-default buttonLogout" onClick={props.onClick}>
        <span className="glyphicon glyphicon-log-out"/>
      </button>
    )
  },
	vk: (props) => {
		return (
			<button className="btn btn-primary" onClick={props.onClick}>VKontakte</button>
		)
	},
}
