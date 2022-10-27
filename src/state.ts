let authenticationToken: string | null = null;

const setAuthenticationToken = (token: string) => {
  authenticationToken = token;
};

const getAuthenticationToken = () => {
  return authenticationToken;
};

export { setAuthenticationToken, getAuthenticationToken };
