# @applaud/postcss-svgo

> Optimise inline SVG with PostCSS.


## Install

With [npm](https://npmjs.org/package/@applaud/postcss-svgo) do:

```
npm install @applaud/postcss-svgo --save
```


## Example

### Input

```css
h1 {
    background: url('data:image/svg+xml;charset=utf-8,<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><circle cx="50" cy="50" r="40" fill="yellow" /></svg>');
}

h2 {
    background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9InllbGxvdyIgLz48IS0tdGVzdCBjb21tZW50LS0+PC9zdmc+');
}
```

### Output

```css
h1 {
    background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="%23ff0"/></svg>');
}

h2 {
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQwIiBmaWxsPSIjZmYwIi8+PC9zdmc+');
}
```


## API

### `svgo([options])`

Note that postcss-svgo is an *asynchronous* processor. It cannot be used
like this:

```js
var result = postcss([ svgo() ]).process(css).css;
console.log(result);
```

Instead make sure your PostCSS runner uses the asynchronous API:

```js
postcss([ svgo() ]).process(css).then(function (result) {
    console.log(result.css);
});
```

#### options

##### encode

Type: `boolean`
Default: `undefined`

If `true`, it will encode URL-unsafe characters such as `<`, `>` and `&`;
`false` will decode these characters, and `undefined` will neither encode nor
decode the original input. Note that regardless of this setting, `#` will
always be URL-encoded.

##### plugins

Optionally, you can customise the output by specifying the `plugins` option. You
will need to provide the config in comma separated objects, like the example
below. Note that you can either disable the plugin by setting it to `false`,
or pass different options to change the default behaviour.

```js
var postcss = require('postcss');
var svgo = require('@applaud/postcss-svgo');

var opts = {
    plugins: [{
        removeDoctype: false
    }, {
        removeComments: false
    }, {
        cleanupNumericValues: {
            floatPrecision: 2
        }
    }, {
        convertColors: {
            names2hex: false,
            rgb2hex: false
        }
    }]
};

postcss([ svgo(opts) ]).process(css).then(function (result) {
    console.log(result.css)
});
```

You can view the [full list of plugins here][plugins].


## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for
examples for your environment.



## License

MIT ?? [Ben Briggs](http://beneb.info)

[postcss]: https://github.com/postcss/postcss
[plugins]: https://github.com/svg/svgo/tree/master/plugins


<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/Applaud-devpack">
          <img width="150" height="150" src="https://github.com/Applaud-devpack.png?v=3&s=150">
          </br>
          Applaud Dev team
        </a>
      </td>
    </tr>
  <tbody>
</table>

