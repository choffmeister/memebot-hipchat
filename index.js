var RestClient = new require('node-rest-client').Client;

var config = {
  giphy: {
    token: 'dc6zaTOxFJmzC', // public beta token
    search: 'family+guy' // what to search giphy for
  },
  hipChat: {
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
client.get('http://api.giphy.com/v1/gifs/search?q=' + config.giphy.search + '&api_key=' + config.giphy.token, function(data1, res1){
  var imageUrl = random(data1.data).images.original.url;

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

  client.post('https://api.hipchat.com/v2/room/' + config.hipChat.room + '/notification?auth_token=' + config.hipChat.token, messageArgs, function (data2, res2) {
    // do nothing
  });
});
