import { UDAdigestMessage } from '../util';

export const UDAUserAuthData = { id: '', email: '', restrict_add_delete: false, role: 'default', permissions: '' };

export const udaauthdata = {
    set id(val) {
        if (!val) return;
        UDAdigestMessage(val, "SHA-512").then((encrypted:string)=>{
            UDAUserAuthData.id = encrypted;
            const sessionEvent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
            document.dispatchEvent(sessionEvent);
        });
    },
    get id() {
        return UDAUserAuthData.id;
    },
    set email(val) {
        UDAdigestMessage(val, "SHA-512").then(encrypted=>{
            UDAUserAuthData.email = encrypted;
            const sessionEvent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
            document.dispatchEvent(sessionEvent);
        });
    },
    get email() {
        return UDAUserAuthData.email;
    },
    set userRole(val) {
        UDAUserAuthData.role = val;
        var sessionEvent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
        document.dispatchEvent(sessionEvent);
    },
    get userRole() {
        return UDAUserAuthData.role;
    },
    set restrict_add_delete(val) {
        UDAUserAuthData.restrict_add_delete = val;
        var sessionEvent = new CustomEvent("UDADisableButton", {detail: {data: "UDADisableButton"}, bubbles: false, cancelable: false});
        document.dispatchEvent(sessionEvent);
    },
    get restrict_add_delete() {
        return UDAUserAuthData.restrict_add_delete;
    },
    set permissions(val) {
        UDAUserAuthData.permissions = val;
    },
    get permissions() {
        return UDAUserAuthData.permissions;
    }
};