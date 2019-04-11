module.exports = {
    cards(root, args, { prisma }) {
        return prisma.column({ id: root.id }).cards()
    }
}
