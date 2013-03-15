describe("define.js", function() {
  'use strict';

  define('test/one', [], function() {
    return { id: 123 };
  });

  define('domain/person', [], function() {

    var Person = {
      firstName: 'John',
      lastName: 'Doe',
      getFullName: function() {
        return this.firstName + ' ' + this.lastName;
      }
    };

    return {
      createPerson: function() {
        return Object.create(Person);
      }
    };

  });

  define('service/person', ['domain/person'], function(Person) {
    return Person.createPerson();
  });

  define('module1', [], function() {
    return {
      op1: function() {
        return 'module1.op1';
      },
      op2: function() {
        return 'called ' + this.op1();
      }
    };
  });

  define('module2', ['module1'], function(Mod1) {
    return {
      op: function() {
        return Mod1.op2();
      }
    };
  });

  it("should load a module", function() {
    require(['test/one'], function(test) {
      expect(test.id).toBe(123);
      expect(window.test.one).toBe(test);
    });
  });

  it("should load libraries from global scope", function() {
    require(['jQuery'], function(jq) {
      expect(jq.fn.jquery).toBe('1.9.1');
    });
  });

  it("should load module from separate file", function() {
    require(['domain/person'], function(Person) {
      expect(Person.createPerson().getFullName()).toBe('John Doe');
    });
  });

  it("should load module with dependency", function() {
    require(['service/person'], function(PersonService) {
      expect(PersonService.getFullName()).toBe('John Doe');
    });
  });

  it("should cache instance", function() {
    require(['service/person'], function(PersonService) {
      expect(PersonService.getFullName()).toBe('John Doe');
      PersonService.firstName = 'Jane'; 
    });
    require(['service/person'], function(PersonService) {
      expect(PersonService.getFullName()).toBe('Jane Doe');
    });
  });

  it("should redefine with overrides", function() {
    redefine('service/person', {
      'domain/person': { 
        createPerson: function() { return { value: 'test' }; } 
      }
    });
    require(['service/person'], function(PersonService) {
      expect(PersonService.value).toBe('test');
    });
    redefine('service/person');
    require(['service/person'], function(PersonService) {
      expect(PersonService.getFullName()).toBe('John Doe');
    });
  });

  it("should override methods on the module itself", function() {
    redefine('module1', {}, function(mod) {
      return $.extend({}, mod, { op1: function() { return 'overriden'; } });
    });
    require(['module1'], function(mod) {
      expect(mod.op2()).toBe('called overriden');
    });
    redefine('module1');
  });

  define('nodeps', function() {
    return { value: 'nodeps' };
  });

  it("should handle modules with no dependencies", function() {
    require(['nodeps'], function(Mod) {
      expect(Mod.value).toBe('nodeps');
    });
  });

  it("should handle anonymous modules", function() {
    var value = null;
    define(function() {
      value = 'testing';
    });
    expect(value).toBe('testing');
  });

});

