function Push (user_secret_id, url=null) {
	if (url === null) {
		this.socket = io.connect('http://localhost:8000');
	}else{
		this.socket = io.connect(url);
	}
	this.user_secret_id = user_secret_id;
	if(window.WebSocket){
    	this.is_socket_work = 1;
	} else {
	    this.is_socket_work = 0;
	}
}
Push.prototype.login = function  (user_secret_id) {
	this.socket.emit('login',{user_secret_id:this.user_secret_id});
}
Push.prototype.getNotification = function(count,callback) {
	this.socket.emit('requestNotification',{user_secret_id:this.user_secret_id,count:count});
	this.socket.on('receiveNotification',function  (data) {
		callback(data);
	})
};
Push.prototype.log = function(action, message) {
	if (action === 'url') {
		action = window.location.href
	}
	this.socket.emit('log', {action:action, message:message});
}