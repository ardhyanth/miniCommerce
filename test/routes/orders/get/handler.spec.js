const { expect } = require('chai');
const sinon = require('sinon');
const handler = require('../../../../src/routes/orders/get/handler');

describe('get orders handler', () => {
  let mockRequest;
  let mockH;
  let Order;

  beforeEach(async () => {
    Order = {
      getById: sinon.stub(),
    };
    mockRequest = {
      server: {
        models: () => ({
          Order,
        }),
      },
      params: {
        id: 1,
      },
    };
    mockH = {
      response: (data) => data,
    };
  });

  it('should responds success if data found', async () => {
    Order.getById.resolves({ id: 1 });
    const expectedResult = {
      data: {
        id: 1,
      },
      description: 'data has been retrieved successfully',
      status: 'success',
    };

    const res = await handler(mockRequest, mockH);

    expect(res).to.deep.equal(expectedResult);
  });

  it('responds failed if no data found', async () => {
    Order.getById.resolves(null);
    const expectedResult = {
      description: 'no data found',
      status: 'failed',
    };

    const res = await handler(mockRequest, mockH);

    expect(res).to.deep.equal(expectedResult);
  });
});
