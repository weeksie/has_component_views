# HasComponentViews

Handling child views in Backbone can be a bit of a pain in the arse
and at minumum requires writing a lot of boilerplate code. This
component is a small add on to make handling of child components more
declarative and less verbose. It was developed at
[Plyfe](https://www.plyfe.me) for our very front-end heavy social
gaming application. Dig around and have fun! (PS, [we're
hiring](https://www.plyfe.me/jobs))

## Requirements

* underscore
* backbone
* jquery (or whatever `$` lib)
* inflection (included under lib)

## Example usage

### View

```javascript
    var TopLevel = Backbone.View.extend({
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


