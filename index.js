var util = require('util'),
    RestClient = new require('node-rest-client').Client;

var config = {
  giphy: {
    url: 'http://api.giphy.com/v1/gifs/search?q=%s&api_key=%s',
    token: 'dc6zaTOxFJmzC', // public beta token
    search: 'family+guy' // what to search giphy for
  },
  hipChat: {
    url: 'https://api.hipchat.com/v2/room/%s/notification?auth_token=%s',
    token: '', // fill
    room: '' // fill
  }
};

var random = function (arr) {
  var length = arr.length;
  var index = Math.floor(Math.random() * length);
  return arr[index];
};

var client = new RestClient();
var giphyUrl = util.format(config.giphy.url, config.giphy.search, config.giphy.token);
var hipChatUrl = util.format(config.hipChat.url, config.hipChat.room, config.hipChat.token);

client.get(giphyUrl, function(giphyData, giphyRes){
  var imageUrl = random(giphyData.data).images.original.url;

  var messageArgs = {
    data: {
      'color': 'random',
      'message': imageUrl,
      'notify': false,
      'message_format': 'text'
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  client.post(hipChatUrl, messageArgs, function (hipChatData, hipChatRes) {
    // do nothing
  });
});
