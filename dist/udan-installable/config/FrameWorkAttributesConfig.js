export const FrameWorkAttributesConfig = [
    // list of angular framework related attributes, tags and classes
    {
        frameWorkName: "angular",
        list: {
            attributes: ['ng-click'],
            domProperties: [],
            domPropertiesStartsWith: ['_ng', '__context', '__zone_symbol'],
        }
    },
    // list of react framework related attributes, tags and classes
    {
        frameWorkName: "react",
        list: {
            attributes: ['onClick'],
            domProperties: [],
            domPropertiesStartsWith: ['__react'],
        }
    },
    // list of vue framework related attributes, tags and classes
    {
        frameWorkName: "vue",
        list: {
            attributes: [],
            domProperties: [],
            domPropertiesStartsWith: [],
        }
    },
];
