import {getFromStore, setToStore} from "./index";
import {CONFIG} from "../config/endpoints";
import {UDADigestMessage} from "./UDADigestMessage";

export const UDAGetSessionKey = async () => {
    let sessionKey = getFromStore(CONFIG.UDA_SESSION_KEY, true);
    if(!sessionKey) {
        sessionKey = await UDADigestMessage();
        setToStore(sessionKey, CONFIG.UDA_SESSION_KEY, true);
    }
    return sessionKey;
}
