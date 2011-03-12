var Messaging = Messaging || {};

Messaging.Publisher = function(socket) {
  this._socket = socket;
};

Messaging.Publisher.prototype._socket = null;

Messaging.Publisher.prototype.publish = function(message) {
  this._socket.send(message);
};

Messaging.Publisher.prototype.notifyPlayerPaddlePushedUp = function() {
  this._socket.send({ message: 'paddlepushedup' });
};

Messaging.Publisher.prototype.notifyPlayerPaddlePushedDown = function() {
  this._socket.send({ message: 'paddlepusheddown' });
};