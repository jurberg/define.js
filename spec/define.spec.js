describe("define.js", function() {

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

});

