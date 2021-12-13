const { expect, use } = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const handler = require('../../../../src/routes/orders/patch/handler');

use(sinonChai);

describe('patch orders handler', () => {
  let mockRequest;
  let mockH;
  let Order;
  let TransactionAdjustment;

  beforeEach(async () => {
    Order = {
      updateById: sinon.stub(),
      getById: sinon.stub(),
    };
    TransactionAdjustment = {
      insertOne: sinon.stub(),
    };
    mockRequest = {
      server: {
        models: () => ({
          Order,
          TransactionAdjustment,
        }),
      },
      payload: {
        id: 10,
        status: 'pending',
      },
    };
    mockH = {
      response: (data) => data,
    };
  });

  it('should return failed if no data found', async () => {
    Order.getById.resolves(null);
    const expectedResult = {
      description: 'no data found',
      status: 'failed',
    };

    const res = await handler(mockRequest, mockH);

    expect(res).to.deep.equal(expectedResult);
  });

  it('should return failed if existing data is not in pending status', async () => {
    Order.getById.resolves({ status: 'accept' });
    const expectedResult = {
      description: 'order is already on final status',
      status: 'failed',
    };

    const res = await handler(mockRequest, mockH);

    expect(res).to.deep.equal(expectedResult);
  });

  it('should call transaction adjustment to insert new data on accept', async () => {
    Order.getById.resolves({ status: 'pending', sku: 'sku A', qty: 12 });
    mockRequest.payload.status = 'accept';
    const expectedResult = {
      sku: 'sku A',
      qty: -12,
    };

    await handler(mockRequest, mockH);

    expect(TransactionAdjustment.insertOne).to.be.calledWith(expectedResult);
  });

  it('should call order model to update data on cancel', async () => {
    Order.getById.resolves({ status: 'pending', sku: 'sku A', qty: 12 });
    mockRequest.payload.status = 'cancel';

    await handler(mockRequest, mockH);

    expect(Order.updateById).to.be.calledWith({ status: 'cancel' });
  });

  it('should give error response if status not valid', async () => {
    Order.getById.resolves({ status: 'pending', sku: 'sku A', qty: 12 });
    mockRequest.payload.status = 'invalidStatus';
    const expectedResponse = {
      status: 'failed',
      description: 'invalid "status" payload value',
    };

    const res = await handler(mockRequest, mockH);

    expect(res).to.be.deep.equal(expectedResponse);
  });
});
