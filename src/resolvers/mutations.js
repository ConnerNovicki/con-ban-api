const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const APP_SECRET = 'SUPER_SECRET_KEY'

module.exports = {
    async createUser(root, args, { prisma }) {
        const encryptedPassword = await bcrypt.hash(args.password, 10)
        const user = await prisma.createUser({ ...args, password: encryptedPassword })
        const token = await jwt.sign({ userId: user.id }, APP_SECRET)
        return {
            user,
            token
        }
    },
    createBoard(root, {name, userId }, { prisma }) {
        return prisma.createBoard({
            name,
            user: { connect: { id: userId } }
          })
    },
    async login(root, { username, password }, { prisma }) {
        const user = await prisma.user({ username })
        if (!user) {
            throw new Error('User does not exist')
        }
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        }
        const token = await jwt.sign({ userId: user.id }, APP_SECRET)
        return {
            user,
            token
        }
    },
    deleteUserBoard(root, { boardId }, { prisma }) {
        return prisma.deleteBoard({ id: boardId })
    },
    createColumn(root, { boardId, name }, { prisma }) {
        return prisma.createColumn({
            name,
            board: { connect: { id: boardId } }
        })
    },
    createCard(root, { columnId, name, color }, { prisma }) {
        return prisma.createCard({
            name,
            color,
            column: { connect: { id: columnId }}
        })
    },
    deleteColumn(root, { id }, { prisma }) {
        return prisma.deleteColumn({ id })
    },
    deleteCard(root, { id }, { prisma }) {
        return prisma.deleteCard({ id })
    },
    updateCard(root, { id, name, color }, { prisma }) {
        return prisma.updateCard({ where: { id }, data: { color, name }})
    }
}
