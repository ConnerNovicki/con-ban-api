const { GraphQLServer } = require('graphql-yoga')
// const { rule, shield, and, or, not } = require('graphql-shield')
const jwt = require('jsonwebtoken');
const resolvers = require('./resolvers')
const { prisma } = require('../generated/prisma-client')
const APP_SECRET = 'SUPER_SECRET_KEY'

// const getUserId = (req) => {
//     console.log(req.req)
//     let auth 
//     try {
//         auth = req.get('Authorization')
//     } catch (e) {
//         return false
//     }
//     if (!auth) {
//         return false
//     }
//     const token = Authorization.replace('Bearer ', '')
//     const { userId } = jwt.verify(token, APP_SECRET)
//     return userId
// }

// const isAuthenticated = rule()(async (parent, args, ctx, info) => {
//     return ctx.isUserAuth
// })

// const permissions = shield({
//     Query: {
//         getUsers: isAuthenticated,
//         getBoardsForUser: isAuthenticated,
//     },
//     Mutation: {
//         createUser: not(isAuthenticated),
//         createBoard: isAuthenticated
//     }
// })

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => ({
        ...request,
        prisma
    })
})
server.start(() => console.log('Server is running on localhost:4000'))