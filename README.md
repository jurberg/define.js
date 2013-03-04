define.js
=========

A simple way to define modules using the familiar AMD syntax.

## Background

The AMD spec provides a clean way to define and use modules.  A library like Require.JS works great, but sometimes you don't need the full features.  For example, you may be using a framework like Grails that provides it's own way to bundle Javascript.  This library was developed to allow using the familiar AMD define syntax, but leave out the loading.

This library differs from other module libaries because it places your module on the global object. This allows to access the module outside of a require call (for example, in an event handler on the html) and it allows you to access other global libraries as modules.  For example, you can access jQuery as 'jQuery'.

## Usage

1. Load define.js
2. Load 3rd party libaries.
3. Define your modules using the define function.  
4. Manaully load the modules in the correct order.
5. Enjoy

## Unit testing
Sometimes you need to mock out a dependency.  The 'reload' method allows you to reload a module with dependencies mocked out; just pass in an override hash with the module name and the mock.

## Development
Define.js is built using grunt.js.  Run 'npm install', then use grunt commands.

## Examples

### Define a module
```javascript
define('domain/person', [], function() {
  var Person = { name: 'John Doe' };
  return {
    createPerson: function() { return Object.create(Person); }
  };
});
```

### Define a module with dependencies
This example uses the person module plus jQuery.
```javascript
define('view/person', ['domain/person', 'jQuery'], function(Person, $) {
  var person = Person.createPerson();
  return {
    showPerson: function() {
      $('#person-div').html(person.name);
    }
  };
});
```    

### Access a module in html
Since modules are defined on the global object, you can access them in html.
```html
<a onclick="view.person.showPerson(); return false;">Show person</a>
<div id="person-div"></div>
```

### Test with a mock
```javascript
reload('service/person', { 'domain/person': {
  createPerson: function() {
    return { value: 'my mock data' };
  }
});
require(['service/person'], function(PersonService) {
  // do something with PersonService
});
// call reload with no overrides to reload with no mocks
reload('service/person');
```      
