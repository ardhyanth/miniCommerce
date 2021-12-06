const { expect, use } = require('chai');
const sinonChai = require('sinon-chai');
const handler = require('../../../../src/routes/orders/patch/handler');
const sinon = require('sinon');
const mockKnex = require('../../helper/mockKnex');

use(sinonChai);

describe('patch orders handler', () => {
    let mockRequest;

    beforeEach(async () => {
        mockRequest = {
            server: {
                models: () => {
                    return {
                        Order: mockKnex,
                        TransactionAdjustment: mockKnex
                    }
                }
            },
            payload: {
                id: 10,
                status: 'pending'
            }
        };
    });

    it('should return failed if no data found', async () => {
        mockKnex.first = sinon.stub().resolves(null);
        const expectedResult = {
            description: 'no data found',
            status: 'failed'
        }

        const res = await handler(mockRequest, {});

        expect(res).to.deep.equal(expectedResult);
    });

    it('should return failed if existing data is not in pending status', async () => {
        mockKnex.first = sinon.stub().resolves({ status: 'accept' });
        const expectedResult = {
            description: 'order is already on final status',
            status: 'failed'
        }

        const res = await handler(mockRequest, {});

        expect(res).to.deep.equal(expectedResult);
    });

    it('should call transaction adjustment to insert new data on accept', async () => {
        mockKnex.first = sinon.stub().resolves({ status: 'pending', sku: 'sku A', qty: 12 });
        mockRequest.payload.status = 'accept';
        const expectedResult = {
            sku: 'sku A',
            qty: -12
        }

        await handler(mockRequest, {});

        expect(mockKnex.insert).to.be.calledWith(expectedResult)
    });

    it('should call order model to update data on cancel', async () => {
        mockKnex.first = sinon.stub().resolves({ status: 'pending', id: 1, sku: 'sku A', qty: 12 });
        mockRequest.payload.status = 'cancel';

        await handler(mockRequest, {});

        expect(mockKnex.update).to.be.calledWith({ status: 'cancel' })
    });

    it('should do nothing if status not valid', async () => {
        mockKnex.first = sinon.stub().resolves({ status: 'pending', id: 1, sku: 'sku A', qty: 12 });
        mockRequest.payload.status = 'invalidStatus';

        const res = await handler(mockRequest, {});

        expect(res).to.be.equal(undefined);
    });
});
