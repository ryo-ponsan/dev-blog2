import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import newsletter from '../pages/api/newsletter.ts'

const originalNodeEnv = process.env.NODE_ENV
process.env.NODE_ENV = 'test'
after(() => {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV
  else process.env.NODE_ENV = originalNodeEnv
})

function request(overrides = {}) {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'blog.test', origin: 'https://blog.test' },
    body: { email: 'reader@example.test' },
    ...overrides,
  }
}

function response() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value
    },
    status(value) {
      this.statusCode = value
      return this
    },
    json(value) {
      this.body = value
      return this
    },
  }
}

test('rejects invalid requests before contacting a provider', async (t) => {
  const outbound = t.mock.method(globalThis, 'fetch', () => {
    throw new Error('Unexpected outbound request')
  })
  const cases = [
    [request({ method: 'GET' }), 405],
    [
      request({
        headers: {
          'content-type': 'application/json',
          origin: 'http://blog.test',
          host: 'blog.test',
        },
      }),
      403,
    ],
    [request({ headers: { 'content-type': 'text/plain' } }), 415],
    [
      request({
        headers: {
          'content-type': 'application/json',
          origin: 'https://other.test',
          host: 'blog.test',
        },
      }),
      403,
    ],
    [
      request({
        headers: { 'content-type': 'application/json', origin: 'null', host: 'blog.test' },
      }),
      403,
    ],
    [request({ body: { email: {} } }), 400],
    [request({ body: { email: 'a'.repeat(255) + '@example.test' } }), 400],
    [request({ body: { email: 'reader\r\n@example.test' } }), 400],
  ]
  for (const [req, status] of cases) {
    const res = response()
    await newsletter(req, res)
    assert.equal(res.statusCode, status)
  }
  assert.equal(outbound.mock.callCount(), 0)
})

test('does not call a provider when unconfigured', async (t) => {
  const original = process.env.BUTTONDOWN_API_KEY
  delete process.env.BUTTONDOWN_API_KEY
  t.after(() => {
    if (original === undefined) delete process.env.BUTTONDOWN_API_KEY
    else process.env.BUTTONDOWN_API_KEY = original
  })
  const outbound = t.mock.method(globalThis, 'fetch', () => {
    throw new Error('Unexpected outbound request')
  })
  const res = response()
  await newsletter(request(), res)
  assert.equal(res.statusCode, 503)
  assert.equal(outbound.mock.callCount(), 0)
})

test('forwards a valid subscription only to the configured provider with a timeout', async (t) => {
  const original = process.env.BUTTONDOWN_API_KEY
  process.env.BUTTONDOWN_API_KEY = 'test-placeholder'
  t.after(() => {
    if (original === undefined) delete process.env.BUTTONDOWN_API_KEY
    else process.env.BUTTONDOWN_API_KEY = original
  })
  const outbound = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.buttondown.email/v1/subscribers')
    assert.equal(options.headers.Authorization, 'Token test-placeholder')
    assert.equal(options.method, 'POST')
    assert.deepEqual(JSON.parse(options.body), { email_address: 'reader@example.test' })
    assert.ok(options.signal instanceof AbortSignal)
    return new Response('{}', { status: 201 })
  })
  const res = response()
  await newsletter(request(), res)
  assert.equal(res.statusCode, 201)
  assert.equal(outbound.mock.callCount(), 1)
})

test('does not expose provider error bodies or exception messages', async (t) => {
  const original = process.env.BUTTONDOWN_API_KEY
  process.env.BUTTONDOWN_API_KEY = 'test-placeholder'
  t.after(() => {
    if (original === undefined) delete process.env.BUTTONDOWN_API_KEY
    else process.env.BUTTONDOWN_API_KEY = original
  })
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response('provider-private-detail', { status: 401 })
  )
  const failed = response()
  await newsletter(request(), failed)
  assert.equal(failed.statusCode, 502)
  assert.deepEqual(failed.body, { error: 'Subscription failed' })
  globalThis.fetch = async () => {
    throw new Error('provider-private-detail')
  }
  const thrown = response()
  await newsletter(request(), thrown)
  assert.deepEqual(thrown.body, { error: 'Subscription failed' })
})
