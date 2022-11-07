import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "http://localhost:8543/",
    realm: "UDAN",
    clientId: "react-authenticate"
});

export default keycloak;
