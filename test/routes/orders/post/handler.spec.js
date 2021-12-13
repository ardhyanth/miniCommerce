const { expect, use } = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const handler = require('../../../../src/routes/orders/post/handler');

use(sinonChai);

describe('post orders handler', () => {
  let mockRequest;
  let Order;
  let Product;
  let mockH;

  beforeEach(async () => {
    Order = {
      insertPendingOrder: sinon.stub(),
    };
    Product = {
      insertOne: sinon.stub(),
      getBySku: sinon.stub(),
    };
    mockRequest = {
      server: {
        models: () => ({
          Order,
          Product,
        }),
      },
      payload: {
        sku: '123123',
        qty: 1,
      },
    };
    mockH = {
      response: (data) => data,
    };
  });

  it('should return failed if no product found', async () => {
    Product.getBySku.resolves(null);
    const expectedResult = {
      description: 'no product with specified SKU found',
      status: 'canceled',
    };

    const res = await handler(mockRequest, mockH);

    expect(res).to.deep.equal(expectedResult);
  });

  it('should call insert if product found', async () => {
    Product.getBySku.resolves({ id: 1 });

    await handler(mockRequest, mockH);

    expect(Order.insertPendingOrder).to.be.calledWith({
      sku: '123123',
      qty: 1,
    }, ['*']);
  });
});
