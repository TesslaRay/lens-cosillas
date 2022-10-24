let authenticationToken: string | null = null;

const setAuthenticationToken = (token: string) => {
  authenticationToken = token;

  //   console.log("setAuthenticationToken: token", token);
};

const getAuthenticationToken = () => {
  console.log(
    "getAuthenticationToken: authenticationToken",
    authenticationToken
  );
  return authenticationToken;
};

export { setAuthenticationToken, getAuthenticationToken };
