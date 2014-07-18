define(function(){

  var structure = '{{ structure }}';

  return {
    /**
     *
     * @param req
     * @returns {*}
     */
    getCurrentUrl: function(req)
    {
      if (req.hasOwnProperty('toUrl')){

        // toUrl
        return req.toUrl('.').split('?')[0];
      } else {

        // Normalize
        return req('.').split('?')[0];
      }

    },

    /**
     *
     * @param config
     * @param url
     * @returns {*}
     */
    getCurrentModule: function(config, url)
    {
      var baseUrl = config.baseUrl;
      var prefix = config.structure.prefix;

      return url.replace(
        new RegExp('^.*'+(baseUrl + prefix.replace('{module}', ''))),
        '').split('/')[0];
    },

    /**
     *
     * @param path
     * @param config
     * @param url
     * @returns {string}
     */
    path: function(path, config, url, module)
    {
      var prefix = config.structure.prefix;

      return prefix.replace('{module}',
        (module || this.getCurrentModule(config, url))
      ) + path;
    },

    /**
     *
     * @param name
     * @returns {*}
     */
    value: function(name)
    {
      var parts = name.split(':');
      var placeholder;

      if (parts.length == 1){
        placeholder = parts[0];
      } else if (parts.length == 2) {
        placeholder =  parts[1];
      } else {
        throw new Error('Invalid require path format for structure plugin');
      }

      if (placeholder[0] == '@'){
        placeholder = placeholder.substr(1);
      }

      return placeholder;
    },

    /**
     *
     * @param name
     * @returns {*}
     */
    module: function(name)
    {
      var parts = name.split(':');

      if (parts.length != 2){
        return null;
      }

      return parts[0];
    },



    /**
     *
     * @param type
     * @param name
     * @param config
     * @param url
     * @returns {string}
     */
    reqPath: function (type, name, config, url)
    {
      var structure = config.structure;

      var component = this.value(name);

      var path = structure[type].path
        .replace(new RegExp('{' + type + '}', 'g'), component);

      var module = this.module(name);

      return this.path(path, config, url, module);
    },

    /**
     *
     * @param name
     * @param normalize
     * @returns {*}
     */
    normalize: function (name, normalize)
    {
      var normalized;

      if (name.split(':').length == 1){

        var config = requirejs.s.contexts._.config;

        var module = this.getCurrentModule(config, config.baseUrl  + this.getCurrentUrl(normalize));

        normalized = module + ':' + name;

      } else {
        normalized = name;
      }

      return normalized;
    },

    /**
     *
     * @param type
     * @param name
     * @param req
     * @param onload
     * @param config
     */
    process: function(type, name, req, onload, config)
    {
      //config.structure = '{{ structure }}';

      var reqPath = this.reqPath(type, name, config, this.getCurrentUrl(req));

      req([reqPath], function(value){
        onload(value);
      });
    },

    /**
     *
     * @param name
     * @param req
     * @param onload
     * @param config
     */
    load: function (name, req, onload, config) {

      this.process('{{ name }}', name, req, onload, config);
    }
  }
});