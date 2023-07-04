import * as olo from '@onlabsorg/olojs/browser';

export default new olo.URIStore({
    http: new olo.HTTPStore('http:/'),
    https: new olo.HTTPStore('https:/'),
    home: new olo.HTTPStore(`${location.origin}/docs/`, {extension:"olo"})
});
