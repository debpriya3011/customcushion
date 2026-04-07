const { prisma } = require('./src/lib/prisma');
async function test() {
  console.log("Testing Prisma...");
  const users = await prisma.user.findMany({ take: 1 });
  console.log("Users found:", users.length);
  console.log("Prisma works perfectly!");
}
test().catch(e => {
  console.error("Prisma failed to run!");
  console.error(e);
});
