const { expect, use } = require('chai');
const sinonChai = require('sinon-chai');
const handler = require('../../../../src/routes/orders/post/handler');
const sinon = require('sinon');
const mockKnex = require('../../helper/mockKnex');

use(sinonChai);

describe('post orders handler', () => {
    let mockRequest;

    beforeEach(async () => {
        mockRequest = {
            server: {
                models: () => {
                    return {
                        Order: mockKnex,
                        Product: mockKnex
                    }
                }
            },
            payload: {
                sku: '123123',
                qty: 1
            }
        };
    });

    it('should return failed if no product found', async () => {
        mockKnex.first = sinon.stub().resolves(null);
        const expectedResult = {
            description: 'no product with specified SKU found',
            status: 'canceled'
        }

        const res = await handler(mockRequest, {});

        expect(res).to.deep.equal(expectedResult);
    });

    it('should call insert if product found', async () => {
        mockKnex.first = sinon.stub().resolves({});

        await handler(mockRequest, {});

        expect(mockKnex.insert).to.be.calledWith({
            sku: '123123',
            qty: 1,
            status: 'pending'
        })
    });
});
