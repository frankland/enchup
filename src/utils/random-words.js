var Boop = require('boop');


module.exports = Boop.extend({
  initialize: function() {
    this.used = [];
    this.words = ['apple', 'banana', 'orange', 'cat', 'kitten', 'brutal', 'metal', 'gridcore', 'frankland'];
  },

  next: function() {
    if (this.used.length == this.words.length) {
      this.used = [];
    }

    var index = this.getRandomIndex();

    /**
     * Yeah! This is funny :)
     */
    while (this.used.indexOf(index) != -1) {
      index = this.getRandomIndex();
    }

    this.used.push(index);

    return this.words[index];
  },

  random: function() {
    var index = this.getRandomIndex();
    return this.words[index];
  },

  getRandomIndex: function() {
    return Math.floor(Math.random() * this.words.length);
  }
});
