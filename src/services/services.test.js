import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { request, setUnauthorizedHandler } from './apiClient';
import { login, register, restoreSession } from './authService';
import { createProblem, getProblem, submitFeedback } from './problemService';

const reply = (status, data) =>
  Promise.resolve(
    new Response(data === undefined ? null : JSON.stringify(data), { status })
  );

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  document.cookie = 'XSRF-TOKEN=abc';
});
afterEach(() => {
  vi.unstubAllGlobals();
  document.cookie = 'XSRF-TOKEN=; max-age=0';
  setUnauthorizedHandler(() => {});
});

describe('apiClient', () => {
  it('sends JSON with the CSRF token on changes', async () => {
    fetch.mockReturnValue(reply(200, { role: 'citizen' }));
    await login({ email: 'a@b.com', password: 'x' });
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('/api/auth/login');
    expect(options.headers).toEqual({
      'X-XSRF-TOKEN': 'abc',
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(options.body)).toEqual({ email: 'a@b.com', password: 'x' });
  });

  it('fetches the CSRF cookie first when it is missing', async () => {
    document.cookie = 'XSRF-TOKEN=; max-age=0';
    fetch.mockImplementationOnce(() => {
      document.cookie = 'XSRF-TOKEN=fresh';
      return reply(204);
    });
    fetch.mockReturnValueOnce(reply(200, {}));
    await request('/x', { method: 'POST' });
    expect(fetch.mock.calls[1][1].headers['X-XSRF-TOKEN']).toBe('fresh');
  });

  it('shows the server message', async () => {
    fetch.mockReturnValue(reply(409, { message: 'Already exists' }));
    await expect(register({})).rejects.toMatchObject({
      message: 'Already exists',
      status: 409,
    });
  });

  it('explains network failures and non-JSON errors', async () => {
    fetch.mockRejectedValueOnce(new TypeError('failed'));
    await expect(request('/x')).rejects.toThrow('could not be reached');
    fetch.mockResolvedValueOnce(new Response('<html>', { status: 502 }));
    await expect(request('/x')).rejects.toThrow('could not complete');
  });

  it('reports an expired session, but not a failed login', async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    fetch.mockImplementation(() => reply(401, { message: 'no' }));
    await expect(login({})).rejects.toThrow('no');
    expect(handler).not.toHaveBeenCalled();
    await expect(request('/problems')).rejects.toThrow('no');
    expect(handler).toHaveBeenCalledOnce();
  });
});

describe('services', () => {
  it('treats 204 as signed out', async () => {
    fetch.mockReturnValue(reply(204));
    expect(await restoreSession()).toBeNull();
  });

  it('returns null only for a missing problem', async () => {
    fetch.mockReturnValueOnce(reply(404, { message: 'x' }));
    expect(await getProblem('a/b')).toBeNull();
    expect(fetch.mock.calls[0][0]).toBe('/api/problems/a%2Fb');
    fetch.mockReturnValueOnce(reply(500, { message: 'boom' }));
    await expect(getProblem('a')).rejects.toThrow('boom');
  });

  it('sends a report as a form', async () => {
    fetch.mockReturnValue(reply(201, { id: 'P1' }));
    await createProblem({ title: 'T', photo: null });
    const { body, headers } = fetch.mock.calls[0][1];
    expect(body).toBeInstanceOf(FormData);
    expect(body.has('photo')).toBe(false);
    expect(headers).not.toHaveProperty('Content-Type'); // the browser adds the boundary
  });

  it('sends feedback to the right problem', async () => {
    fetch.mockReturnValue(reply(200, { id: 'P1' }));
    await submitFeedback('P1', { rating: 4 });
    expect(fetch.mock.calls[0][0]).toBe('/api/problems/P1/feedback');
  });
});
