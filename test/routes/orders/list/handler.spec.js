const { expect } = require('chai');
const sinon = require('sinon');
const handler = require('../../../../src/routes/orders/list/handler');
const mockOrders = require('../../../fixtures/orders');

describe('list orders handler', () => {
  let mockRequest;
  let mockH;
  let Order;

  beforeEach(async () => {
    Order = {
      list: sinon.stub(),
      countAll: sinon.stub(),
    };
    mockRequest = {
      server: {
        models: () => ({
          Order,
        }),
      },
      query: {
        limit: undefined,
        page: undefined,
      },
    };
    mockH = {
      response: (data) => data,
    };
  });

  it('should return expected result', async () => {
    Order.countAll.resolves({ count: 20 });
    Order.list.resolves(mockOrders);
    const expectedResult = {
      data: [
        {
          id: 1,
          qty: 20,
          sku: 'sku A',
        },
        {
          id: 2,
          qty: 22,
          sku: 'sku B',
        },
        {
          id: 3,
          qty: 25,
          sku: 'sku C',
        },
      ],
      dataInfo: {
        from: 0,
        to: 3,
        total: 20,
      },
      pageInfo: {
        currentPage: 1,
        lastPage: 2,
      },
    };

    const res = await handler(mockRequest, mockH);

    expect(res).to.deep.equal(expectedResult);
  });
});
