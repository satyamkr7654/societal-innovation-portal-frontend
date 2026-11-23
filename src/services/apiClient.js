/** The only place that talks HTTP. Cookies carry the session; scripts never see the token. */

let onUnauthorized = () => {};

/** Called when the server says the session has ended. */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function csrfToken() {
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function send(path, options) {
  try {
    return await fetch(`/api${path}`, { credentials: 'same-origin', ...options });
  } catch {
    throw new ApiError('The server could not be reached. Please try again.', 0);
  }
}

/** `body` is sent as JSON unless it is FormData. Returns null for an empty response. */
export async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (method !== 'GET') {
    if (!csrfToken()) await send('/auth/me'); // the server sets the CSRF cookie here
    headers['X-XSRF-TOKEN'] = csrfToken() || '';
  }
  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  const response = await send(path, {
    method,
    headers,
    body: body === undefined || isForm ? body : JSON.stringify(body),
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (response.ok && data !== null) return data;

  if (response.status === 401 && !path.startsWith('/auth/')) onUnauthorized();
  throw new ApiError(
    data?.message || 'The server could not complete the request. Please try again.',
    response.status
  );
}
