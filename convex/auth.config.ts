export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL, // Must match token `iss`
      applicationID: "convex",              // Must match token `aud`
    },
  ],
};
