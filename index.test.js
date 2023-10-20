const assert = require('chai').assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Send notification test', () => {
  let main = null, stub,
    obj;

  before(() => {
    stub = sinon.stub();
    main = proxyquire('./index.js', {
      'web-push': {
        setVapidDetails: Function(),
        sendNotification: stub
      }
    });

    obj = {
      body: JSON.stringify({
        message: {
          body: "Testing mns"
        },
        subscriptions: [{
          endpoint: "endpoint1"
        }, {
          endpoint: "endpoint2"
        }]
      }),
    }
  })

  beforeEach(() => {
    stub.reset();
  })

  it('Send notification is performed successfully', async () => {
    stub.resolves();
    const invalidSubscriptions = await main.handler(obj);

    assert.equal(invalidSubscriptions.length, 0);
  })

  it('Send notification could send one notification', async () => {
    stub.withArgs({endpoint: "endpoint1"}, JSON.stringify({body: 'Testing mns'})).resolves();
    stub.withArgs({endpoint: "endpoint2"}, JSON.stringify({body: 'Testing mns'})).rejects({
      statusCode: 410
    });

    const invalidSubscriptions = await main.handler(obj);

    assert.equal(invalidSubscriptions.length, 1);
  })

  it('Send notification could not send any notification', async () => {
    stub.rejects({
      statusCode: 410
    });

    const invalidSubscriptions = await main.handler(obj);

    assert.equal(invalidSubscriptions.length, 2);
  })

  it('Send notification fails for unknown reason', async () => {
    stub.rejects();

    const invalidSubscriptions = await main.handler(obj);

    assert.equal(invalidSubscriptions.length, 0);
  })
})