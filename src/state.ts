let authenticationToken: string | null = null;

const setAuthenticationToken = (token: string) => {
  authenticationToken = token;

  //   console.log("setAuthenticationToken: token", token);
};

const getAuthenticationToken = () => {
  return authenticationToken;
};

export { setAuthenticationToken, getAuthenticationToken };
