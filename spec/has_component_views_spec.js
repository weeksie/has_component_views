describe("HasComponentViews", function(){
  var ViewClass,
      Namespace,
      view;
  
  beforeEach(function(){
    Namespace = {
      ComponentA: Backbone.View.extend({}),
      ComponentB: Backbone.View.extend({})
    };
    
    ViewClass  = Backbone.View.extend({
      namespace: Namespace,
      components: "ComponentA",
      initialize: function() {
        this.hasComponentViews();
      }
    });
    
    view = new ViewClass({ model: new Backbone.Model() });
    
    this.addMatchers({
      toHaveComponent: function(key) {
        if(typeof this.actual.getComponent(key) === 'undefined') {
          this.message = function() {
            return "Expected " + key.camelize() + " to be registered under the key: " + key;
          };
          return false;
        }
        return true;
      }
    });
  });
  
  it("should add HasComponentViews methods", function() {
    expect(view.registerComponents).toBeDefined(); 
  });
  
  it("should register components as a scalar value", function() {
    expect(view).toHaveComponent("component_a");
    expect(view.getComponent("component_a").model).toEqual(view.model);
  });

  it("should register multiple components as an array", function() {
    view.registerComponents([ "ComponentA", "ComponentB" ]);
    expect(view).toHaveComponent("component_a");
    expect(view).toHaveComponent("component_b");
  });
  
  it("should register components as an object", function() {
    var a, b;
    view.apetits    = "APETITS";
    view.collection = "MURDERBONER";
    
    view.registerComponents({
      ComponentA: { collection: "collection", fnord: "hagbard" },
      ComponentB: { model: "apetits" }
    });
    
    expect(view).toHaveComponent("component_a");
    expect(view).toHaveComponent("component_b");
    
    a = view.getComponent("component_a");
    b = view.getComponent("component_b");
    
    expect(a.collection).toEqual(view.collection);
    expect(a.options.fnord).toEqual("hagbard");
    expect(b.model).toEqual(view.apetits);
  });
  
  it("should render components to corrosponding dom selectors", function(){
    var a  = view.getComponent("component_a"),
        jq = { append: jasmine.createSpy("append") };
    
    spyOn(a, "render").andReturn(a);
    spyOn(view, "$").andReturn(jq);

    view.renderComponents();
    expect(a.render).toHaveBeenCalled();
    expect(view.$).toHaveBeenCalledWith(".component-a");
    expect(jq.append).toHaveBeenCalledWith(a.el);
  });

  it("should default the namespace to `window` if none is defined", function(){
    window.ComponentA = Backbone.View.extend({});
    view.namespace = undefined;
    view.hasComponentViews();
    expect(view).toHaveComponent("component_a");
  });

  afterEach(function(){
    delete window.ComponentA;
  });
});
