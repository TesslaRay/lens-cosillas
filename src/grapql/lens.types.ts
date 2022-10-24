export type ChallengueRequest = {
  request: {
    address: string;
  };
};

export type SignedAuthChallenge = {
  request: {
    address: string;
    signature: string;
  };
};

export type FollowRequest = {
  request: {
    follow: [{ profile: string }];
  };
};
