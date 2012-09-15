## Example usage

### View

```javascript
    var TopLevel = Backbone.View.exten({
      components: [ "Header", "BodyContent" ],
      initialize: function() {
        this.model.on("change", this.render, this);
        this.hasComponentViews();
      },
      render: function() {
        this.$el.html(this.template({ model: this.model }));
        this.renderComponents();
        return this;
      }
    });
```

### Template
```
   .page
     .header 
     .body-content
```

Components are attached to the hyphenised versions of their class name. e.g.
`BodyContent` will be attached to the element with the `.body-content` CSS class.

The components declaration can be a single string, e.g. "BodyContent",
an array (as above), or an object.

```javascript
    components: {
      Header: { model: "headerModel", arbitrary: "methodName", option: "static value" }
    }
```

In this case the `Header` view will be instantiated with the following values:

```javascript
    { model: this.headerModel, arbitrary: this.methodName(), option: "static value" }
```

Values passed are tested in the following order: `_.isFunction(this[value]), this[value], value`

