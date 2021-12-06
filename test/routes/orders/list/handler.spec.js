const { expect } = require('chai');
const handler = require('../../../../src/routes/orders/list/handler');
const sinon = require('sinon');
const mockKnex = require('../../helper/mockKnex');
const mockOrders = require('./../../../fixtures/orders')

describe('list orders handler', () => {
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
            query: {
                limit: undefined,
                page: undefined
            }
        };
    });

    it('should return expected result', async () => {
        mockKnex.first = sinon.stub().resolves({ count: 20 });
        mockKnex.offset = sinon.stub().resolves(mockOrders);
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
            }
        }

        const res = await handler(mockRequest, {});

        expect(res).to.deep.equal(expectedResult);
    });
});
