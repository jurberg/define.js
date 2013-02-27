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
