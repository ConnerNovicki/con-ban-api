const { GraphQLServer } = require('graphql-yoga')
const { rule, shield, and, or, not } = require('graphql-shield')
const jwt = require('jsonwebtoken');
const resolvers = require('./resolvers')
const { prisma } = require('../generated/prisma-client')
const APP_SECRET = 'SUPER_SECRET_KEY'

const getUserId = (ctx) => {
    const auth = ctx.request.get('Authorization')
    if (!auth) {
        return false
    }
    const token = auth.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
}

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return !!ctx.userId
})

const isAuthorizedUser = rule()(async (parent, args, ctx, info) => {
    if (!args.userId) {
        return new Error('Improper JWT: No userId')
    }
    if (!ctx.userId) {
        return new Error('This route requires userId param')
    }

    if (args.userId === ctx.userId) {
        return true
    }

    return new Error('userId provided and JWT credentials do not match.')
})

const permissions = shield({
    Query: {
        getUsers: isAuthenticated,
        getBoardsForUser: and(isAuthenticated, isAuthorizedUser),
        getBoard: isAuthenticated,
    },
    Mutation: {
        createUser: isAuthenticated,
        createBoard: and(isAuthenticated, isAuthorizedUser),
        createColumn: isAuthenticated,
        createCard: isAuthenticated,
        deleteColumn: isAuthenticated,
        deleteUserBoard: isAuthenticated,
        deleteCard: isAuthenticated,
        updateCard: isAuthenticated,
    }
})

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    middlewares: [permissions],
    context: context => ({
        ...context,
        userId: getUserId(context),
        prisma
    })
})
server.start(() => console.log('Server is running on localhost:4000'))