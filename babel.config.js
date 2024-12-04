module.exports = {
  // Root configuration object - Core feature since Babel 6.0.0
  "presets": [
    ["@babel/preset-env", {
      // Defines browser targets - Available since Babel 7.0.0
      "targets": "> 0.25%, not dead",              // Target browsers with >0.25% market share

      // Handles polyfills automatically - Added in Babel 7.4.0
      "useBuiltIns": "usage",                      // Automatically detect and inject needed polyfills

      // CoreJS version and proposals config - Added in Babel 7.4.0
      "corejs": {
        version: 3,                                // Use CoreJS version 3 for modern polyfills
        proposals: true                            // Enable polyfills for proposal features
      },

      // Preserves ES modules for better tree shaking - Added in Babel 7.0.0
      "modules": false,                            // Keep ES modules for webpack optimization

      // Enables latest bugfixes - Added in Babel 7.9.0
      "bugfixes": true,                            // Enable latest syntax transformations

      // Enables loose mode for better performance - Available since Babel 7.0.0
      "loose": true,                               // Use loose mode for smaller output

      // Excludes unnecessary transformations - Available since Babel 7.0.0
      "exclude": ["transform-typeof-symbol"],      // Skip typeof Symbol() transform

      // Includes specific proposal plugins - Available since Babel 7.0.0
      "include": [
        "@babel/plugin-proposal-optional-chaining",        // Enable ?. operator
        "@babel/plugin-proposal-nullish-coalescing-operator" // Enable ?? operator
      ]
    }],

    ["@babel/preset-react", {
      // Uses new JSX transform - Added in Babel 7.9.0
      "runtime": "automatic",                      // New JSX transform without React import

      // Development mode configuration - Available since Babel 7.0.0
      "development": process.env.NODE_ENV === 'development', // Enable dev-specific features

      // Emotion CSS-in-JS support - Added in Babel 7.10.0
      "importSource": "@emotion/react",            // Configure emotion for styling

      // Enables pure annotation - Added in Babel 7.12.0
      "pure": true,                               // Mark components as pure for optimization

      // Controls XML namespace handling - Available since Babel 7.0.0
      "throwIfNamespace": false                    // Allow XML namespaces in JSX
    }],

    ["@babel/preset-typescript", {
      // Enables TSX support - Available since Babel 7.0.0
      "isTSX": true,                              // Enable TypeScript JSX processing

      // Applies to all file extensions - Available since Babel 7.0.0
      "allExtensions": true,                      // Apply TypeScript to all files

      // Enables namespace support - Added in Babel 7.6.0
      "allowNamespaces": true,                    // Enable TypeScript namespaces

      // Optimizes const enums - Added in Babel 7.15.0
      "optimizeConstEnums": true,                 // Optimize constant enums inlining

      // Only removes type imports - Added in Babel 7.9.0
      "onlyRemoveTypeImports": true               // Smart removal of type imports
    }]
  ],

  "plugins": [
    ["@babel/plugin-transform-runtime", {
      // Runtime helpers configuration - Available since Babel 7.0.0
      "corejs": 3,                                // Use CoreJS 3 for runtime polyfills
      "helpers": true,                            // Enable helper function reuse
      "regenerator": true,                        // Include regenerator runtime
      "useESModules": true,                       // Use ES modules for tree shaking
      "absoluteRuntime": false                    // Use relative runtime paths
    }],

    // Class properties support - Available since Babel 7.0.0
    ["@babel/plugin-proposal-class-properties", {
      // "loose": true,                              // Use loose mode for performance
      "spec": false                               // Don't follow strict spec compliance
    }],

    // Object spread operator support - Available since Babel 7.0.0
    "@babel/plugin-proposal-object-rest-spread",  // Enable {...obj} syntax

    // Macro support - Added in Babel 7.0.0
    "babel-plugin-macros",                        // Enable macro processing

    // Development expressions - Added in Babel 7.1.0
    "babel-plugin-dev-expression",                // Optimize development checks

    // Module resolution and aliases - Available since Babel 7.0.0
    ["babel-plugin-module-resolver", {
      "root": ["./src"],                          // Set source root directory
      "alias": {
        "@": "./src"                              // Define @ alias for imports
      }
    }],

    // Dynamic import optimization - Added in Babel 7.2.0
    ["@babel/plugin-syntax-dynamic-import", {
      "loose": true                               // Use loose mode for smaller output
    }],

    // Decorator support - Added in Babel 7.0.0
    ["@babel/plugin-proposal-decorators", {
      "legacy": true                              // Use legacy decorator behavior
    }],

    // Styled-components optimization - Available since Babel 7.0.0
    ["babel-plugin-styled-components", {
      "pure": true,                               // Enable pure annotations
      "displayName": process.env.NODE_ENV === 'development',  // Show component names in dev
      "fileName": process.env.NODE_ENV === 'development',     // Include file names in dev
      "transpileTemplateLiterals": true,          // Optimize template literals
      "minify": true,                             // Enable minification
      "ssr": true                                 // Enable server-side rendering support
    }],

    // Module extension resolver - Added in Babel 7.8.0
    ["babel-plugin-module-extension-resolver", {
      "dts": true,                                // Enable TypeScript declaration files
      "extensionsToKeep": [".ts", ".tsx"]         // Preserve specific extensions
    }]
  ],

  // Environment-specific configurations - Available since Babel 7.0.0
  "env": {
    "production": {
      "plugins": [
        // Production optimizations - Available since Babel 7.0.0
        ["transform-react-remove-prop-types", {
          "removeImport": true,                   // Remove PropTypes in production
          "ignoreFilenames": ["node_modules"]     // Skip node_modules processing
        }],
        "babel-plugin-transform-react-constant-elements",  // Hoist constant elements
        "babel-plugin-transform-react-inline-elements",    // Inline React elements
        ["babel-plugin-transform-imports", {
          "lodash": {
            "transform": "lodash/${member}",      // Transform to individual imports
            "preventFullImport": true             // Prevent full lodash import
          }
        }],

        // React class optimization - Added in Babel 7.3.0
        "babel-plugin-transform-react-pure-class-to-function",    // Convert pure classes to functions
        "babel-plugin-transform-react-class-to-function",         // Optimize class components

        // Additional production optimizations - Added in Babel 7.4.0
        ["babel-plugin-transform-react-remove-prop-types", {
          "mode": "remove",                       // Remove all prop types
          "removeImport": true,                   // Remove import statements
          "ignoreFilenames": ["node_modules"]     // Skip node_modules
        }]
      ]
    },
    "presets": [
      ["@babel/preset-env", {
        "targets": {
          "node": "current"
        },
        "modules": "commonjs"
      }]
    ],
    "test": {
      "plugins": [
        "@babel/plugin-transform-modules-commonjs" // Use CommonJS in test environment
      ]
    },
    "development": {
      "plugins": [
        // "react-refresh/babel"                     // Enable React Fast Refresh
      ]
    }
  },

  // Compilation assumptions - Added in Babel 7.13.0
  "assumptions": {
    "setPublicClassFields": true,                 // Optimize public class fields
    "privateFieldsAsProperties": true,            // Optimize private fields
    "noDocumentAll": true,                        // Remove document.all checks
    "noClassCalls": true,                         // Optimize class instantiation
    "superIsCallableConstructor": true            // Optimize super() calls
  },

  // Output configuration - Available since Babel 7.0.0
  "compact": true,                                // Remove unnecessary whitespace
  "minified": true,                               // Enable code minification
  "comments": false,                              // Strip comments from output
  "sourceMaps": true,                             // Generate source maps
  "retainLines": process.env.NODE_ENV === 'development',  // Keep line numbers in dev

  // Additional optimization settings - Added in Babel 7.13.0
  "targets": {
    "node": "current",                            // Target current Node.js version
    "browsers": [
      "last 2 versions",                          // Support last 2 versions of browsers
      "> 0.2%",                                   // Support browsers with >0.2% market share
      "not dead",                                 // Exclude dead browsers
      "not ie <= 11"                              // Exclude IE 11 and below
    ]
  }
}
