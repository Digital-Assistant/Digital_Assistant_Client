import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "http://localhost:8080/",
    realm: "udan",
    clientId: "react-authenticate"
});

export default keycloak;
