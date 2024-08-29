const fetchHtmlFormElements = () => {
    return [
        {
            inputElement: "input",
            inputType: ["text", "search", "url"],
            displayName: "Simple Text",
            systemTag: "text",
        },
        {
            inputElement: "input",
            inputType: "checkbox",
            displayName: "Multiple Select",
            systemTag: "multipleChoice",
        },
        {
            inputElement: "input",
            inputType: "radio",
            displayName: "Single Select",
            systemTag: "singleChoice",
        },
        {
            inputElement: "input",
            inputType: "number",
            displayName: "Number Field",
            systemTag: "number",
        },
        {
            inputElement: "input",
            inputType: ["date", "time"],
            displayName: "Date and/or Time Field",
            systemTag: "date",
        },
        {
            inputElement: "input",
            inputType: "email",
            displayName: "Email Field",
            systemTag: "email",
        },
        {
            inputElement: "input",
            inputType: "password",
            displayName: "Password Field",
            systemTag: "password",
        },
        {
            inputElement: "input",
            inputType: "range",
            displayName: "Range Field",
            systemTag: "range",
        },
        {
            inputElement: "input",
            inputType: "tel",
            displayName: "Telephone Field",
            systemTag: "telephone",
        },
        {
            inputElement: "input",
            inputType: "file",
            displayName: "File Selection",
            systemTag: "file",
        },
        // {inputElement: 'input', inputType: 'color', displayName: 'Color Selection'},
        // {inputElement: 'input', inputType: 'datetime-local', displayName: 'Local Date Selection'},
        // {inputElement: 'input', inputType: 'hidden', displayName: 'Hidden Field'},
        // {inputElement: 'input', inputType: 'image', displayName: 'Image Field'},
        // {inputElement: 'input', inputType: 'month', displayName: 'Month Field'},
        // {inputElement: 'input', inputType: 'reset', displayName: 'Reset Field'},
        // {inputElement: 'input', inputType: 'search', displayName: 'Search Field'},
        // {inputElement: 'input', inputType: 'time', displayName: 'Time Field'},
        // {inputElement: 'input', inputType: 'url', displayName: 'URL Field'},
        // {inputElement: 'input', inputType: 'week', displayName: 'Week Field'},
        {
            inputElement: ["select", "option", "optgroup"],
            inputType: "select",
            displayName: "Dropdown Field",
            systemTag: "dropDown",
        },
        // {inputElement: 'option', inputType: 'option', displayName: 'Dropdown Option'},
        // {inputElement: 'optgroup', inputType: 'optgroup', displayName: 'Dropdown Option Group'},
        {
            inputElement: "textarea",
            inputType: "textarea",
            displayName: "Large Text Area",
            systemTag: "textArea",
        },
        {
            inputElement: ["input", "button"],
            inputType: ["button", "submit"],
            displayName: "Button",
            systemTag: "button",
        },
        // {inputElement: 'button', inputType: 'submit', displayName: 'Submit Field'},
        // {inputElement: 'input', inputType: 'button', displayName: 'Button Field'},
        // {inputElement: 'input', inputType: 'submit', displayName: 'Submit Field'},
        // {inputElement: 'output', inputType: 'output', displayName: 'Output Field'},
        // {inputElement: 'datalist ', inputType: 'datalist', displayName: 'Datalist Field'},
        {
            inputElement: "a",
            inputType: "href",
            displayName: "Link",
            systemTag: "link",
        },
        {
            inputElement: "others",
            inputType: "others",
            displayName: "Unrecognized",
            systemTag: "others",
        },
        {
            inputElement: "highlight",
            inputType: "highlight",
            displayName: "Highlight",
            systemTag: "highlight",
        }
    ];
};
export default fetchHtmlFormElements;
//# sourceMappingURL=fetchHtmlFormElements.js.map