import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import SVGO from '@applaud/svgo';
import {encode, decode} from './lib/url';

const PLUGIN = 'postcss-svgo';
const dataURI = /data:image\/svg\+xml(;((charset=)?utf-8|base64))?,/i;
const dataURIBase64 = /data:image\/svg\+xml;base64,/i;

function minifyPromise (decl, getSvgo, opts, postcssResult) {
    const promises = [];
    const parsed = valueParser(decl.value);

    decl.value = parsed.walk(node => {
        if (node.type !== 'function' || node.value.toLowerCase() !== 'url' || !node.nodes.length) {
            return;
        }

        let {value, quote} = node.nodes[0];
        let isBase64, isUriEncoded;
        let svg = value.replace(dataURI, '');

        if (dataURIBase64.test(value)) {
            svg = Buffer.from(svg, 'base64').toString('utf8');
            isBase64 = true;
        } else {
            let decodedUri;

            try {
                decodedUri = decode(svg);
                isUriEncoded = decodedUri !== svg;
            } catch (e) {
                // Swallow exception if we cannot decode the value
                isUriEncoded = false;
            }

            if (isUriEncoded) {
                svg = decodedUri;
            }

            if (opts.encode !== undefined) {
                isUriEncoded = opts.encode;
            }
        }

        promises.push(
            getSvgo().optimize(svg)
                .then(result => {
                    if (result.error) {
                        decl.warn(postcssResult, `${result.error}`);
                        return;
                    }
                    let data, optimizedValue;

                    if (isBase64) {
                        data = Buffer.from(result.data).toString('base64');
                        optimizedValue = 'data:image/svg+xml;base64,' + data;
                    } else {
                        data = isUriEncoded ? encode(result.data) : result.data;
                        // Should always encode # otherwise we yield a broken SVG
                        // in Firefox (works in Chrome however). See this issue:
                        // https://github.com/cssnano/cssnano/issues/245
                        data = data.replace(/#/g, '%23');
                        optimizedValue = 'data:image/svg+xml;charset=utf-8,' + data;
                        quote = isUriEncoded ? '"' : '\'';
                    }

                    node.nodes[0] = Object.assign({}, node.nodes[0], {
                        value: optimizedValue,
                        quote: quote,
                        type: 'string',
                        before: '',
                        after: '',
                    });
                })
                .catch(error => {
                    decl.warn(postcssResult, `${error}`);
                })
        );

        return false;
    });

    return Promise.all(promises).then(() => (decl.value = decl.value.toString()));
}

export default postcss.plugin(PLUGIN, (opts = {}) => {
    let svgo = null;

    const getSvgo = () => {
        if (!svgo) {
            svgo = new SVGO(opts);
        }

        return svgo;
    };

    return (css, result) => {
        return new Promise((resolve, reject) => {
            const svgoQueue = [];

            css.walkDecls(decl => {
                if (!dataURI.test(decl.value)) {
                    return;
                }

                svgoQueue.push(minifyPromise(decl, getSvgo, opts, result));
            });

            return Promise.all(svgoQueue).then(resolve, reject);
        });
    };
});
