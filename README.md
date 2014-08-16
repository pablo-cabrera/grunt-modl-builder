# grunt-modl-builder

> modl builder for browser environments.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-modl-builder --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-modl-builder');
```

## The "modlfy" task

_Run this task with the `grunt modlfy` command._

The modlfy task concatenates **js** files and **sub-modules** within a single file that may be deployed on a web-server.

To tell modlfy which files and sub-modules should be concatenated, a `modl.json` file should be placed on your project root.

`modl.json`
```json
{
    "files": [
        "lib/foo.js",
        "src/**/*.js"
    ],

    "modules": [
        "bar",
        "baz"
    ]
}
```

The JSON only has the `files` entry and the `modules` entry. The `files` should be an array of files (supports node-glob patterns), and the `modules` should be an array of sub-modules (written with modl) required on the `package.json` as dependencies themselves.

### Options

#### options.build
Type: `String`
Default value: `build`

The location where the modlfied file should be put


### Usage Example

```js
grunt.initConfig({
    modlfy: {
        build: "custom-build"
    }
});
```
