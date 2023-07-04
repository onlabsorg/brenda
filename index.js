const olo = require('@onlabsorg/olojs');
const pathlib = require('path');
const http = require('http');
const express = require('express');



exports.stilo = {

    commands: {

        brenda (store, cwp, options, path=".") {
            /// starts a Brenda server

            // Print the help message if -h or --help option is passed
            if (options.h || options.help) {
                console.log('stilo-run brenda [options] [path]                                      ');
                console.log('                                                                       ');
                console.log('Starts a Brenda server that renders this repository documents in the   ');
                console.log('browser.                                                               ');
                console.log('                                                                       ');
                console.log('Arguments:                                                             ');
                console.log('  path          path of the directory to be served as store root       ');
                console.log('                                                                       ');
                console.log('Options:                                                               ');
                console.log('  -p, --port    port on which the server will listen (defaults to 8010)');
                console.log('  -h, --help    show this message                                      ');
                console.log('                                                                       ');
                return;
            }

            // Define the store to be served
            const rootPath = pathlib.resolve(cwp, path);
            const rootStore = createStore(store, rootPath);

            // Create and start the server
            const server = createServer(rootStore);
            const port = options.port || options.p || 8010;
            server.listen(port, err => {
                if (err) throw err;
                console.log(`Brenda http-server: serving '${rootPath}' on port ${port}`);
            });

            return server;
        }
    }
}


function createStore (store, rootPath) {
    const _rootStore = store.createSubStore(rootPath);

    const rootStore = Object.create(_rootStore);
    rootStore.read = (path) => {
        if (path.slice(-4) === '.olo') {
            return _rootStore.read(path.slice(0, -4));
        } else {
            return _rootStore.read(path);
        }
    }

    return rootStore;
}

function createServer (rootStore) {
    const app = express();

    app.all("*", (req, res, next) => {
        console.log(req.method, req.path);
        next();
    });

    app.use('/docs',
            olo.HTTPServer.createMiddleware(rootStore) );

    app.use('/',
            express.static(pathlib.join(__dirname, "dist")) );

    return http.createServer(app);
}
