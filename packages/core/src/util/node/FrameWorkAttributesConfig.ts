// This file exports a configuration array that defines framework-specific attributes and properties.
// This configuration is used to identify and handle elements and behaviors specific to frameworks
// like Angular, React, and Vue.

export const FrameWorkAttributesConfig = [
    // Configuration for Angular framework
    {
        frameWorkName: "angular",
        list: {
            // Attributes commonly used in Angular for event binding, like ng-click.
            attributes: ['ng-click'],
            // Specific DOM properties to look for.
            domProperties: [],
            // Prefixes for DOM properties that are dynamically added by Angular.
            domPropertiesStartsWith: ['_ng','__context', '__zone_symbol'],
        }
    },
    // Configuration for React framework
    {
        frameWorkName: "react",
        list: {
            // Attributes used in React for event handling, like onClick.
            attributes: ['onClick'],
            // Specific DOM properties to look for.
            domProperties: [],
            // Prefixes for DOM properties added by React's internal workings.
            domPropertiesStartsWith: ['__react'],
        }
    },
    // Configuration for Vue framework
    {
        frameWorkName: "vue",
        list: {
            // Vue uses a different event handling mechanism (e.g., @click), which might not be reflected as simple attributes.
            attributes: [],
            // Specific DOM properties to look for.
            domProperties: [],
            // Prefixes for DOM properties added by Vue.
            domPropertiesStartsWith: [],
        }
    },

];