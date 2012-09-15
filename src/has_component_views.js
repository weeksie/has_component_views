(function(){
  // Example usage:
  //  View:
  //
  //     var TopLevel = Backbone.View.exten({
  //       components: [ "Header", "BodyContent" ],
  //       initialize: function() {
  //         this.model.on("change", this.render, this);
  //         this.hasComponentViews();
  //       },
  //       render: function() {
  //         this.$el.html(this.template({ model: this.model }));
  //         this.renderComponents();
  //         return this;
  //       }
  //     });
  //
  //  top_level.jade:
  //
  //    .page
  //      .header 
  //      .body-content
  //
  //  Components are attached to the hyphenised versions of their class name. e.g.
  //  BodyContent will be attached to the element with the .body-content CSS class.
  //
  //  The components declaration can be a single string,
  //  e.g. "BodyContent", an array (as above), or an object.
  //
  //     components: {
  //       Header: { model: "headerModel", arbitrary: "methodName", option: "static value" }
  //     }
  //
  //  In this case the Header view will be instantiated with the following values:
  //
  //     { model: this.headerModel, arbitrary: this.methodName(), option: "static value" }
  //
  //  Values passed are tested in the following order:
  //
  //  _.isFunction(this[value]), this[value], value
  //
  // TODO: make this smarter about caching rendered content.
  
  var HasComponentViews = {
    hasComponentViews: function() {
      this.namespace || (this.namespace = window);
      _.extend(this, Methods);
      this.registerComponents(this.components);
    }
  },
      Methods           = {
        _components: { },
        registerComponents: function(components) {
          var self = this;
          function rc(cs) {
            _.each(cs, function(c) {
              self._components[c.underscore()] = new self.namespace[c]({ model: self.model });
            });
          }
          if(typeof components === 'string') {
            rc([ components ]);
          } else if (_.isArray(components)) {
            rc(components);
          } else if (_.isObject(components)) {
            _.each(components, function(opts, c){
              var populated = { };
              _.each(opts, function(v, k) {
                if(typeof self[k] === 'undefined') {
                  populated[k] = v;
                } else {
                  populated[k] = _.isFunction(self[v]) ? self[v]() : self[v];
                }
              });
              self._components[c.underscore()] = new self.namespace[c](populated);
            });
          }
        },
        getComponent: function(key) {
          return this._components[key];
        },
        eachComponent: function(f) {
          _.each(this._components, f);
        },
        renderComponents: function() {
          var self = this;
          _.each(this._components, function(c, key){
            self.$("." + key.dasherize()).append(c.render().el);
          });
        },
        onShow: function() {
          this.eachComponent(function(c) { if(c.onShow) { c.onShow(); } });
        }
      };
  
  _.extend(Backbone.View.prototype, HasComponentViews);
})();