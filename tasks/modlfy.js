
/*
 * grunt-modl-builder
 * https://github.com/pablo/grunt-modl-builder
 *
 * Copyright (c) 2014 Pablo Cabrera
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {
    'use strict';

    var fs = require("fs");
    var path = require("path");
    var uglifyJs = require("uglify-js");

    var processModule = function (files, modules, modulePath, root) {
        var module = {};

        if (!root) {
            root = module;
        }

        files.forEach(function (f) {
            f.src.forEach(function (f) {
                var filePath = path.join(modulePath, f);
                var content = grunt.file.read(filePath);

                module["/" + f.replace(/\.js$/, "")] = content;
                grunt.log.writeln("Adding file " + filePath);
            });
        });

        modules.forEach(function (m) {
            var subModulePath = path.join(modulePath, "/node_modules/", m);

            if (fs.existsSync(subModulePath)) {
                var modl = readModl(subModulePath);
                grunt.log.writeln("Adding subModule " + subModulePath);
                module[m] = processModule(modl.files, modl.modules, subModulePath, root);
            } else {
                module[m] = undefined;
                grunt.log.writeln("Submodule not found " + subModulePath + " skipping...");
            }
        });

        if (module === root) {
            grunt.log.writeln("Processing subModule references");
            processModuleReferences(module, grunt.config("pkg").name);
        }

        return module;
    };

    var processModuleReferences = function (module, name, stack) {
        if (!stack) {
            stack = [];
        }

        getReferences(module).forEach(function (r) {
            var path;
            var i = stack.length - 1;
            var m;

            while (i > -1) {
                m = stack[i];
                if ((r in m.module) && typeof m.module[r] === "object") {
                    path = getPath(stack, m);
                    i = -1;
                }

                i -= 1;
            }

            if (path === undefined) {
                if (r === grunt.config("pkg").name) {
                    path = "";
                } else {
                    throw new Error("Failed to resolve reference: " + r);
                }
            } else {
                path.push(r);
                path.join("/");
            }

            module[r] = path;
        });

        stack.push({
            name: name,
            module: module
        });

        getSubModules(module).forEach(function (subModule) {
            processModuleReferences(module[subModule], subModule, stack);
        });

        stack.pop();
    };

    var getPath = function (stack, ref) {
        return stack.slice(1, stack.indexOf(ref) + 1).map(function (m) { return m.name; });
    };

    var getSubModules = function (module) {
        return Object.keys(module).reduce(function (subs, key) {
            if (key.indexOf("/") !== 0 && typeof module[key] === "object") {
                subs.push(key);
            }

            return subs;
        }, []);
    };

    var getReferences = function (module) {
        return Object.keys(module).reduce(function (refs, key) {
            if (key.indexOf("/") !== 0 && module[key] === undefined) {
                refs.push(key);
            }

            return refs;
        }, [])
    };

    var concatModule = function (module) {
        var chunks = [];
        Object.keys(module).forEach(function (k) {
            var v = module[k];

            var chunk = JSON.stringify(k) + ": ";

            if (k.indexOf("/") === 0) {
                chunk += "function () {" + v + "}";
            } else if (typeof v === "string") {
                chunk += JSON.stringify(v);
            } else {
                chunk += concatModule(v);
            }

            chunks.push(chunk);
        });

        return "{" + chunks.join(",") + "}";
    };

    var readModl = function (p) {
        var json = grunt.file.readJSON(path.join(p, "modl.json"));

        return {
            files: grunt.task.normalizeMultiTaskFiles(json.files),
            modules: ("options" in json? json.options.modules: []) || []
        };
    };

    grunt.registerMultiTask('modlfy', 'modl builder for browser environments.', function() {
        var options = this.options({
            build: "build",
            modules: []
        });

        var module = processModule(this.files, options.modules, ".");
        module = concatModule(module);

        module = "modl.$module(" + module + ");";
        module = uglifyJs.minify(module, { fromString: true }).code;

        grunt.file.write(options.build + "/module.js", module);
    });

};