/*

https://github.com/gruntjs/grunt-contrib-jshint

Copyright (c) 2013 John Urberg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(global) {
    'use strict';

    function getModule(name, parent) {
        var base = global;
        var parts = name.split('/');
        var length = parts.length - (parent ? 1 : 0);
        for (var i = 0; i < length; i++) {
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
        var parts = name.split('/');
        for (var i = parts.length - 1; i >= 0; i--) {
            if (parts[i].length > 0) {
                return parts[i];
            }
        }
        return null;
    }

    function collectDependencies(deps) {
        var mods = [];
        for (var i = 0; i < deps.length; i++) {
            var mod = getModule(deps[i], false);
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
        var base = getModule(name, true);
        base[getLeaf(name)] = callback.apply(global, collectDependencies(deps));
    };

    /**
     * Execute code with dependencies.
     * @param deps - required array of modules this module depends on
     * @param callback - function to execute
     */ 
    global.require = function(deps, callback) {
        callback.apply(global, collectDependencies(deps));
    };

}(this));

