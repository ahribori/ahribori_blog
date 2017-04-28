'use strict';

const DIR = {
    SRC: 'src',
    DEST: 'build'
};
const SRC = {
    SERVER: `server/${DIR.SRC}`,
    CLIENT: `client/${DIR.SRC}`
};
const DEST = {
    SERVER: `${DIR.DEST}`,
    CLIENT: `${DIR.DEST}/client`
};

const BABEL = {
    SERVER: {
        DEV: {
            presets: [
                ['env', {
                    targets: {
                        node: 'current'
                    }
                }]
            ],
            plugins: [
                'transform-object-rest-spread'
            ]
        },
        PROD: {
            presets: [
                ['env', {
                    targets: {
                        node: 'current'
                    }
                }]
            ],
            env: {
                production: {
                    presets: [
                        'babili'
                    ]
                }
            },
            plugins: [
                'transform-object-rest-spread'
            ]
        }
    },
    CLIENT: {
        DEV: {
            presets: [
                ['env', {
                    modules: false
                }],
                'react'
            ],
            plugins: [
                ['transform-object-rest-spread', { useBuiltIns: true }],
                'react-hot-loader/BABEL'
            ]
        },
        PROD: {}
    }
};

module.exports = {
    DIR,
    SRC,
    DEST,
    BABEL
};
