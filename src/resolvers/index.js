const queries = require('./queries')
const mutations = require('./mutations')
const board = require('./board')
const column = require('./column')

module.exports = {
    Query: queries,
    Mutation: mutations,
    Board: board,
    Column: column
}
