describe("Tạo models", () => {
  it("Tạo model", async () => {
    try {
      const generateModel = require("../auto/generate");
      await generateModel();
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
