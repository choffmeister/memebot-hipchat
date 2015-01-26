var util = require('util'),
    _ = require('lodash'),
    RestClient = new require('node-rest-client').Client;

var config = {
  giphy: {
    url: 'http://api.giphy.com/v1/gifs/random?tag=%s&api_key=%s',
    token: 'dc6zaTOxFJmzC', // public beta token
    defaultTag: 'homer+simpson' // what to search giphy for,
  },
  hipChat: {
    retrieveUrl: 'https://api.hipchat.com/v2/room/%s/history/latest?auth_token=%s',
    notificationUrl: 'https://api.hipchat.com/v2/room/%s/notification?auth_token=%s',
    token: '', // fill
    room: '' // fill
  }
};

var parseCommands = function (hipChatMessages) {
  return _.chain(hipChatMessages)
    .map(function (x) { return x.message })
    .filter(function (x) { return x.length > 0 && x.charAt(0) == '/' })
    .map(function (x) {
      var parts = x.split(/ {1,}/g);
      return {
        command: parts[0].slice(1),
        arguments: parts.slice(1)
      }
    })
    .value();
};

var getTag = function (hipChatCommands) {
  var lastTagCommand = _.chain(hipChatCommands).filter(function (x) { return x.command == 'tag' }).last().value();
  return lastTagCommand ? lastTagCommand.arguments.join('+') : config.giphy.defaultTag;
};

var client = new RestClient();
client.get(util.format(config.hipChat.retrieveUrl, config.hipChat.room, config.hipChat.token), function (hipChatRetrieveData, hipChatRetrieveRes) {
  var commands = parseCommands(hipChatRetrieveData.items);
  var tag = getTag(commands);

  client.get(util.format(config.giphy.url, tag, config.giphy.token), function(giphyData, giphyRes) {
    var messageText = giphyData.data.image_original_url || 'Could not find any GIF for tag ' + tag;
    var messageArgs = {
      data: {
        'color': 'random',
        'message': messageText,
        'notify': false,
        'message_format': 'text'
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    client.post(util.format(config.hipChat.notificationUrl, config.hipChat.room, config.hipChat.token), messageArgs, function (hipChatNotificationData, hipChatNotificationRes) {
      // do nothing
    });
  });
});
