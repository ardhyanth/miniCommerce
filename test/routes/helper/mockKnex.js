const sinon = require('sinon');

module.exports = {
    select: sinon.stub().returnsThis(),
    where: sinon.stub().returnsThis(),
    insert: sinon.stub().returnsThis(),
    count: sinon.stub().returnsThis(),
    query: sinon.stub().returnsThis(),
    update: sinon.stub().returnsThis(),
    first: sinon.stub().returnsThis(),
    limit: sinon.stub().returnsThis(),
    delete: sinon.stub().returnsThis()
}
