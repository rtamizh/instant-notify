var socket = io.connect('http://localhost:3000');
if(window.WebSocket){
    console.log('websocket works');
} else {
    console.log('WebSocket not works');
}
function Notification (user_secret_id) {
	this.user_secret_id = user_secret_id;
}
Notification.prototype.login = function  (user_secret_id) {
	socket.emit('login',{user_secret_id:this.user_secret_id});
}
Notification.prototype.getNotification = function(count,callback) {
	socket.emit('requestNotification',{user_secret_id:this.user_secret_id,count:count});
	socket.on('receiveNotification',function  (data) {
		callback(data);
	})
};