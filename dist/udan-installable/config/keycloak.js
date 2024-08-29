import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: process.env.keyCloakUrl,
    realm: "UDAN",
    clientId: "react-app"
});
export default keycloak;
