  
export const CONFIG = {
    current: 'TEST',
    UDADebug: false,
    UDA_DOMAIN: "https://udantest.nistapp.ai",
    UDA_API_URL:(UDADebug) ? "http://localhost:11080/voiceapi" : UDA_DOMAIN + "/voiceapi",
    UDASessionID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    UDA_POST_INTERVAL : 1000,
    set Environment(value) {
        this.current = value.toString().toUpperCase();
        if(this.current==='PROD'){
            this.UDA_DOMAIN = "https://udan.nistapp.ai";
        } else {
            this.UDA_DOMAIN = "https://udantest.nistapp.ai";
        }
        this.UDA_API_URL = this.UDA_DOMAIN+"/voiceapi";
    },
    get Environment() {
        return this.current;
    }
}