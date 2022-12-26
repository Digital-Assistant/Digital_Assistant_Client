import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "https://keycloaktest.nistapp.ai/",
    realm: "UDAN",
    clientId: "react-app"
});

export default keycloak;
