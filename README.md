define.js
=========

A simple way to define modules using the familiar AMD syntax.

## Background

The AMD spec provides a clean way to define and use modules.  A library like Require.JS works great, but sometimes you don't need the full features.  For example, you may be using a framework like Grails that provides it's own way to bundle Javascript.  This library was developed to allow using the familiar AMD define syntax, but leave out the loading.

This library differs from other module libaries because it places your module on the global object. This allows to access the module outside of a require call (for example, in an event handler on the html) and it allows you to access other global libraries as modules.  For example, you can access jQuery as 'jQuery'.

## Usage

1. Load the define.js
2. Load 3rd party libaries
3. Define your modules using the define function




