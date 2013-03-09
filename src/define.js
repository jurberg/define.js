/*

https://github.com/gruntjs/grunt-contrib-jshint

Copyright (c) 2013 John Urberg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
(function(global) {
    'use strict';

    var modules = {};

   function getModule(name, parent) {
        var base = global,
            parts = name.split('/'),
            length = parts.length - (parent ? 1 : 0),
            i = 0;
        for (i = 0; i < length; i++) {
            if (parts[i].length > 0) {
                if (!base[parts[i]]) {
                    base[parts[i]] = {};
                }
                base = base[parts[i]];
            }
        }
        return base;
    }

    function getLeaf(name) {
        var parts = name.split('/'),
            i = 0;
        for (i = parts.length - 1; i >= 0; i--) {
            if (parts[i].length > 0) {
                return parts[i];
            }
        }
        return null;
    }

    function collectDependencies(deps) {
        var mods = [],
            i = 0,
            mod = null;
        for (i = 0; i < deps.length; i++) {
            mod = getModule(deps[i], false);
            if (!mod) {
                throw "Dependency '" + deps[i] + "' has not been loaded.";
            }
            mods.push(mod);
        }
        return mods;
    }

    /**
     * Define a module.
     * @param name - required name for the module.  Use '/' to separate sections of the name.
     * @param deps - required array of modules this module depends on
     * @param callback - function that defines the module
     */
    global.define = function(name, deps, callback) {
        var base = getModule(name, true),
            dependencies = collectDependencies(deps);
        modules[name] = { names: deps, modules: dependencies, callback: callback };    
        base[getLeaf(name)] = callback.apply(global, dependencies);
    };

    /**
     * Execute code with dependencies.
     * @param deps - required array of modules this module depends on
     * @param callback - function to execute
     */ 
    global.require = function(deps, callback) {
        callback.apply(global, collectDependencies(deps));
    };

    /**
     * Reload a module with optional overrides for dependencies and
     * override of module results.
     * @param module name
     * @param optional dependent module overrides { module name -> override for module }
     * @param optional callback to proces the result
     */
     global.redefine = function(name, overrides, callback) {
        var base = getModule(name, true),
            module = modules[name],
            dependencies = [],
            i = 0;
        overrides = overrides || {};    
        callback = callback || function(it) { return it; };
        for (i = 0; i < module.names.length; i++) {
          dependencies.push(overrides[module.names[i]] || module.modules[i]);
        }
        base[getLeaf(name)] = callback(module.callback.apply(global, dependencies));
     };

}(this));

