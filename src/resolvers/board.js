module.exports = {
    columns(root, args, { prisma }) {
        return prisma.board({ id: root.id }).columns()
    }
}
