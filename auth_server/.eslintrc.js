module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "ecmaFeatures": {
        "jsx": true
    },
    "extends": ["eslint:recommended", "airbnb"],
    "plugins": [
        "jsx-a11y",
        "react",
        "import"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        "comma-dangle": ["error", {
            "arrays": "never",
            "objects": "never",
            "imports": "never",
            "exports": "never",
            "functions": "never",
        }],
        "no-param-reassign": 0,
        "linebreak-style": 0,
        "no-plusplus": [
            "error",
            { "allowForLoopAfterthoughts": true }
        ],
        "no-underscore-dangle": 0,
        "import/no-extraneous-dependencies": ["error", {
            "devDependencies": true,
            "optionalDependencies": false,
            "peerDependencies": false
        }],
        "react/jsx-indent": [2, 4],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/no-did-mount-set-state": 0,
    }
};