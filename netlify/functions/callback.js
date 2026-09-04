exports.handler = async function (event) {
  const code = event.queryStringParameters && event.queryStringParameters.code;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!code) {
    return { statusCode: 400, body: 'Missing OAuth code' };
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'text/html' },
        body: renderPostMessage('error', {
          message: tokenData.error_description || tokenData.error || 'Authorization failed',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderPostMessage('success', { token: tokenData.access_token, provider: 'github' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: renderPostMessage('error', { message: err.message }),
    };
  }
};

function renderPostMessage(status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  return `<!DOCTYPE html>
<html>
<body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(
      ${JSON.stringify(message)},
      e.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;
}
