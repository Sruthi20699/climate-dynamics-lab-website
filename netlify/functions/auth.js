exports.handler = async function (event) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const site = process.env.URL || `https://${event.headers.host}`;
  const redirectUri = `${site}/.netlify/functions/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
    },
  };
};
