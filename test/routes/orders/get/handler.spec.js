const { expect } = require('chai');
const handler = require('../../../../src/routes/orders/get/handler');
const sinon = require('sinon');
const mockKnex = require('../../helper/mockKnex')

describe('get orders handler', () => {
    let mockRequest;

    beforeEach(async () => {
        mockRequest = {
            server: {
                models: () => {
                    return {
                        Order: mockKnex
                    }
                }
            },
            params: {
                id: 1
            }
        };
    });

    it('should responds success if data found', async () => {
        mockKnex.first = sinon.stub().resolves({id: 1});
        const expectedResult = {
            data: {
                id: 1
            },
            description: 'data has been retrieved successfully',
            status: 'success'
        };

        const res = await handler(mockRequest, {});

        expect(res).to.deep.equal(expectedResult);
    });

    it('responds failed if no data found', async () => {
        mockKnex.first = sinon.stub().resolves(null);
        const expectedResult = {
            description: 'no data found',
            status: 'failed'
        };

        const res = await handler(mockRequest, {});

        expect(res).to.deep.equal(expectedResult);
    });
});
