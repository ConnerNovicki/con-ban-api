module.exports = {
    getUsers(root, args, { prisma, request }) {
        return prisma.users()
    },
    async getBoardsForUser(root, { userId }, { prisma }) {
        const boards = await prisma.user({ id: userId }).boards()
        if (!boards) {
            throw new Error('There was an error fetching user boards')
        }
        return boards
    },
    getBoard(root, { boardId }, { prisma }) {
        return prisma.board({ id: boardId })
    }
}
