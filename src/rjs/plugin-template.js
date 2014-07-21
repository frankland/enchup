define(function(){

  var components = '{{ structure }}';
  var component = '{{ name }}';

  function unique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function cutExtension(path){
    return path.replace(/\.[^\.]+$/,'')
  }

  function getPlaceholders(path, keys){

    var placeholders = path.match(/(:[^\/|:|\-|\.]+:?)/g);

    if (!placeholders || !placeholders.length){
      throw new Error('Wrong format');
    }

    placeholders = placeholders.filter(unique);

    if (!validate(keys, placeholders)){
      throw new Error('Wrong format');
    }

    var result = {};

    for (var i = 0, size = placeholders.length; i < size; i++){
      var key = clearPlaceholder(placeholders[i]);

      result[key] = {
        placeholder: placeholders[i],
        value: keys[i]
      }
    }

    return result;
  }

  function clearPlaceholder(key){
    if (key[0] == ':'){
      key = key.slice(1);
    }

    if (key[key.length - 1] == ':'){
      key = key.slice(0, -1);
    }
    return key;
  }

  function validate(keys, placeholders){
    var result = true;

    if (!keys.length || !placeholders.length){
      result = false;
    }

    if (keys.length != placeholders.length){
      result = false;
    }

    return result;
  }

  function loadDependencies(name){
    var path = components[name || component];

    var placeholders = path.match(/(\^[^\/|:|-]+:?)/g);

    if (!placeholders || !placeholders.length){
      return path;
    }

    placeholders = placeholders.filter(unique);

    for (var i = 0, size = placeholders.length; i < size; i++){
      var key = placeholders[i].slice(1);
      if (!components.hasOwnProperty(key)){
        throw new Error('Wrong format');
      }

      var sub = loadDependencies(key);

      if (!sub){
        throw new Error('Wrong format');
      }

      sub = cutExtension(sub);

      path = path.replace(placeholders[i], sub);
    }

    return path;
  }

  function getPath(key, current){

    var keys = key.split(':'),
      path = false,
      placeholders = {};

    if (!components.hasOwnProperty(component)){
      throw new Error('No component');
    } else {

      path = loadDependencies();

      placeholders = getPlaceholders(path, keys);

      currentPlaceHolders(path, current, placeholders);

      for (var name in placeholders){
        if (placeholders.hasOwnProperty(name)){
          var placeholder = placeholders[name];

          var re = new RegExp(placeholder.placeholder, 'g');
          path = path.replace(re, placeholder.value);
        }
      }
    }

    return path;
  }

  function currentPlaceHolders(path, current, placeholders){

    var parts = {
      current: current.split('/'),
      path: path.split('/')
    };

    for (var i = 0, size = parts.current.length; i < size; i++){
      if (parts.path[i][0] == ':') {
        var part = clearPlaceholder(parts.path[i]);
        placeholders[part].value = parts.current[i];
      }
    }
  }

  return {

    load: function (name, req, onload, config) {

      var current = req.toUrl('.').split('?')[0].replace(config.baseUrl, '');

      var path = config.baseUrl + getPath(name, current);

      req([path], function(value){
        onload(value);
      });
    }
  }
});