function defaultRequest(type, request, sending, callback) {
  const xhr = new window.XMLHttpRequest();
  xhr.open(type, request);
  if (type === 'POST') {
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(sending));
  } else {
    xhr.send();
  }
  xhr.onload = (event) => {
    switch (event.target.status) {
      case 200:
        callback(event.target.responseText);
        break;
      default:
        window.alert('Ошибка ' + event.target.responseText);
    }
  };
}

const server = {
  auth: {
    signUp: (data, callback) => {
      defaultRequest('POST', '/api/user/signup', data, callback);
    },
    logIn: (data, callback) => {
      defaultRequest('POST', '/api/user/login', data, callback);
    },
	  vk: (callback) => {
		  defaultRequest('GET', '/api/user/vk', null, callback);
	  },
    logOut: (callback) => {
      defaultRequest('GET', '/api/user/logout', null, callback);
    },
    getUser: (callback) => {
      defaultRequest('GET', '/api/user', null, callback);
    },
  },
  action: {
    getHistory: (data, callback) => {
      defaultRequest('POST', '/api/user/history', data, callback);
    },
	  sendMessage: (data, callback) => {
		  defaultRequest('POST', '/api/user/message', data, callback);
	  },
	  getOnlines: (callback) => {
		  defaultRequest('GET', '/api/user/online', null, callback);
	  },
  },
};

export default server;
