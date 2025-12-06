import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient()

async function main(){
    const itemStatus = await prisma.postStatus.createMany({data : [
        {statusName : "Hilang"},
        {statusName : "Ditemukan"}
    ]})

    const itemCategory = await prisma.postCategory.createMany({
      data : [
        {categoryName : "Handphone"},
        {categoryName : "Laptop"},
        {categoryName : "Kartu"},
        {categoryName : "Dompet"},
        {categoryName : "Lain Lain"}
      ]
    })
    console.log({itemCategory, itemStatus})
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
