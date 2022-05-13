const sync = require("../sequelize/sync");
const sql = require("../sequelize/sequelize");

describe("[HAPPI CASES] Thêm xoá sửa đọc User", () => {
  let dummyUser;
  // sync database bf test
  beforeAll(async () => {
    await sync();
  });

  beforeEach(async () => {
    dummyUser = await sql.query(
      `INSERT INTO Users (id, email, password, createdAt, updatedAt) VALUES ('d3e93366-628a-49ad-82e6-6c44589c7f98', 'dummy@dummy.com', 'mat khau', '2022-05-13 05:25:36', '2022-05-13 05:25:36')`
    );
    dummyNote = await sql.query(
      `INSERT INTO Notes (id, name, content,  createdAt, updatedAt, UserId) VALUES ('d3e93366-628a-49ad-82e6-6c44589c7f98', 'dummy', 'dummy', '2022-05-13 05:25:36', '2022-05-13 05:25:36', 'd3e93366-628a-49ad-82e6-6c44589c7f98')`
    );
  });

  // clean up all test data
  afterEach(async () => {
    await sql.query("DELETE FROM Users");
    await sql.query("DELETE FROM Tokens");
    await sql.query("DELETE FROM Notes");
  });

  afterAll(async () => {
    await sql.close();
  });

  describe("CREATE", () => {
    it("phải tạo user nhưng không kèm bất kỳ associates", async () => {
      const user = await sql.model("User").create({
        email: "test@test.com",
        password: "test",
      });

      // kỳ vọng user đã tạo thành công và không có bất kỳ associate nào
      expect(user).toBeDefined();
      expect(user.email).toBe("test@test.com");
      expect(user.Tokens).not.toBeDefined();
      expect(user.Notes).not.toBeDefined();
    });

    it("phải tạo user với một associates", async () => {
      const user = await sql.model("User").create(
        {
          email: "test@test.com",
          password: "test",
          // tạo token của user test
          Tokens: [
            {
              token: "test token",
            },
          ],
          // associate note bên dưới sẽ không được tạo kèm với user tét do include không có khai báo
          Notes: [
            {
              name: "test note",
              content: "test note content",
            },
          ],
        },
        // đánh dấu để sequelize tạo kèm đối tượng associates là "Token" mà không kèm "Note"
        {
          include: ["Notes"],
        }
      );

      // kỳ vọng user đã tạo thành công
      expect(user).toBeDefined();
      expect(user.email).toBe("test@test.com");

      // kỳ vọng note đã tạo kèm với user
      expect(user.Notes).toBeDefined();
      expect(user.Notes).toBeInstanceOf(Array);
      expect(user.Notes.length).toBe(1);

      // kỳ vọng token không tồn tại
      expect(user.Tokens).not.toBeDefined();
    });

    it("phải tạo user kèm theo tất cả associates", async () => {
      const user = await sql.model("User").create(
        {
          email: "test@test.com",
          password: "test",
          // tạo token của user test
          Tokens: [
            {
              token: "test token",
            },
          ],
          // tạo note của uset test
          Notes: [
            {
              name: "test note",
              content: "test note content",
            },
          ],
        },
        // đánh dấu để sequelize tạo "TẤT CẢ" các đối tượng associates với user test
        {
          include: { all: true },
        }
      );

      // kỳ vọng user đã tạo thành công
      expect(user).toBeDefined();
      expect(user.email).toBe("test@test.com");

      // kỳ vọng note đã tạo kèm với user
      expect(user.Notes).toBeDefined();
      expect(user.Notes).toBeInstanceOf(Array);
      expect(user.Notes.length).toBe(1);

      // kỳ vọng token đã tạo kèm với user
      expect(user.Tokens).toBeDefined();
      expect(user.Tokens).toBeInstanceOf(Array);
      expect(user.Tokens.length).toBe(1);
    });
  });

  describe("UPDATE", () => {
    it("phải cập nhật user email", async () => {
      const [affectedCount] = await sql
        .model("User")
        .update(
          { email: "updated@test.com" },
          { where: { id: "d3e93366-628a-49ad-82e6-6c44589c7f98" } }
        );
      const updated = await sql
        .model("User")
        .findOne({ where: { id: "d3e93366-628a-49ad-82e6-6c44589c7f98" } });

      // kỳ vọng 1 row đã được updated giá trị mới
      expect(affectedCount).toBe(1);
      expect(updated.email).toBe("updated@test.com");
    });

    it("phải cập nhật 2 fields của user", async () => {
      const [affectedCount] = await sql
        .model("User")
        .update(
          { email: "updated 2@test.com", password: "updated" },
          { where: { id: "d3e93366-628a-49ad-82e6-6c44589c7f98" } }
        );
      const updated = await sql
        .model("User")
        .findOne({ where: { id: "d3e93366-628a-49ad-82e6-6c44589c7f98" } });

      // kỳ vọng 1 row đã được updated giá trị mới
      expect(affectedCount).toBe(1);
      expect(updated.email).toBe("updated 2@test.com");
      expect(updated.password).toBe("updated");
    });

    it("tạo một token và liên kết token với user", async () => {
      const token = await sql.model("Token").create({
        token: "test token",
      });

      const user = await sql
        .model("User")
        .findByPk("d3e93366-628a-49ad-82e6-6c44589c7f98");

      token.User = user;
      // expect no exception will be thrown here
      await token.save();

      expect(token).toBeDefined();
      expect(token.id).toBeDefined();
      expect(token.User).toBeDefined();
      expect(token.User.id).toBe("d3e93366-628a-49ad-82e6-6c44589c7f98");
    });
  });

  describe("DELETE", () => {
    it("phải xóa user", async () => {
      const count = await sql
        .model("User")
        .destroy({ where: { id: "d3e93366-628a-49ad-82e6-6c44589c7f98" } });

      const [result] = await sql.query(
        "SELECT * FROM Users WHERE id = 'd3e93366-628a-49ad-82e6-6c44589c7f98'"
      );
      expect(count).toBe(1);
      expect(result.length).toBe(0);
    });
  });

  describe("READ", () => {
    it("tìm tất cả users", async () => {
      const users = await sql.model("User").findAll();

      expect(users).toBeDefined();
      expect(users.length).toBe(1);
    });

    it("tìm user theo điều kiện", async () => {
      const user = await sql
        .model("User")
        .findOne({ where: { email: "dummy@dummy.com" } });

      expect(user).toBeDefined();
      expect(user.email).toBe("dummy@dummy.com");
    });

    it("tìm user theo primary key", async () => {
      const user = await sql
        .model("User")
        .findByPk("d3e93366-628a-49ad-82e6-6c44589c7f98");

      expect(user).toBeDefined();
      expect(user.email).toBe("dummy@dummy.com");
    });

    it("tìm 1 user by primary key kèm theo associate", async () => {
      const user = await sql
        .model("User")
        .findByPk("d3e93366-628a-49ad-82e6-6c44589c7f98", {
          include: ["Notes", "Tokens"],
        });

      console.log("🚀 ~ file: user.test.js ~ line 212 ~ it ~ user", user);

      expect(user).toBeDefined();
      expect(user.email).toBe("dummy@dummy.com");
      expect(user.Notes).toBeDefined();
      expect(user.Notes.length).toBe(1);
      expect(user.Notes[0].name).toBe("dummy");
      expect(user.Notes[0].content).toBe("dummy");
      expect(user.Tokens).toBeDefined();
      expect(user.Tokens.length).toBe(0);
    });
  });
});
