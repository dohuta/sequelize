const sync = require("./sequelize/sync");

const main = async () => {
  // sync database -> create tables
  await sync();

  const noteRepo = require("./repositories/Note.repo");

  const createdNote = await noteRepo.create(
    {
      name: "Note 1",
      content: "Content 1",
      // tạo luôn user:
      User: {
        email: "test@test.com",
        password: "123456",
      },
    },
    { include: ["User"] }
  );

  console.log(createdNote.toJSON());
};

main();
