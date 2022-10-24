import { GraphQLClient } from "graphql-request";
import { getAuthenticationToken } from "./state";

const lensClient = new GraphQLClient("https://api.lens.dev/playground");

const changeHeaders = () => {
  const token = getAuthenticationToken();

  lensClient.setHeaders({
    "x-access-token": token ? `Bearer ${token}` : "",
  });
};

export { lensClient, changeHeaders };
