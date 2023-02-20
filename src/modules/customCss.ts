export const UDACustomCss = {
    src:'',
    loaded: false,
    set url(val) {
        this.src = val;
        document.dispatchEvent(new CustomEvent("UDALoadCustomCSS", {detail: {data: "UDALoadCustomCSS"}, bubbles: false, cancelable: false}));
        this.loaded = true;
    },
    get url(){
        return this.src;
    }
};