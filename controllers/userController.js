const stationModel = require("../models/station");
// controllers/userController.js

const userModel = require("../models/user");
const adminModel = require("../models/admin");

const userController = {
  async renderUserMap(req, res) {
    try {
      // Lấy thông tin người dùng từ session
      const userId = req.session.user.manguoidung;
      const userInfo = await userModel.getUserInfoWithCar(userId);
      let stations = [];
      const allStations = await stationModel.findAll();
      // Nếu người dùng không có xe, hiển thị tất cả trạm sạc
      if (!userInfo.maxe) {
        stations = await stationModel.findAll();
        const compatibleStations = []; // Khởi tạo nếu không có
        const otherStations = [];
        return res.render("user", {
          stations,
          userInfo,
          compatibleStations,
          otherStations,
          allStations,
        });
      }
      // Nếu người dùng có xe, lấy danh sách trạm sạc tương thích và không tương thích
      const { compatibleStations, otherStations } =
        await userModel.getStationsByCar(
          userInfo.mahangxe,
          userInfo.chuansac_xe
        );

      res.render("user", {
        compatibleStations,
        otherStations,
        userInfo,
        stations,
        allStations,
      });
    } catch (error) {
      console.error("Lỗi khi render trang bản đồ cho người dùng:", error);
      res.status(500).send("Lỗi server");
    }
  },

  async renderUserInfo(req, res) {
    try {
      const userId = req.session.user.manguoidung;

      // Lấy thông tin người dùng và danh sách xe sở hữu
      const userInfo = await userModel.getUserInfoWithCar(userId);
      const userCars = await userModel.getUserCars(userId);
      const allCars = await adminModel.getAllXe();

      res.render("infoUser", { userInfo, userCars, allCars });
    } catch (error) {
      console.error("Lỗi khi render trang thông tin người dùng:", error);
      res.status(500).send("Lỗi server");
    }
  },

  async updateUserCar(req, res) {
    try {
      const { userId, carId } = req.body;

      // Cập nhật maxe trong bảng nguoidung
      await userModel.updateUserCar(userId, carId);

      res.redirect("/user/info"); // Chuyển hướng về trang thông tin người dùng
    } catch (error) {
      console.error("Lỗi khi cập nhật xe cho người dùng:", error);
      res.status(500).send("Lỗi server");
    }
  },

  async addUserCar(req, res) {
    try {
      const { userId, carId } = req.body;

      // Thêm xe vào danh sách sở hữu của người dùng
      await userModel.addUserCar(userId, carId);

      res.redirect("/user/info");
    } catch (error) {
      console.error("Lỗi khi thêm xe cho người dùng:", error);
      res.status(500).send("Lỗi server");
    }
  },
  async deleteUserCar(req, res) {
    try {
      const { userId, carId } = req.body;
      // Kiểm tra nếu xe đang được chọn, nếu đúng thì xóa maxe trong bảng nguoidung
      const userInfo = await userModel.getUserInfoWithCar(userId);
      if (userInfo.maxe === parseInt(carId)) {
        await userModel.updateUserCar(userId, null);
      }
      await userModel.deleteUserCar(userId, carId);

      res.redirect("/user/info");
    } catch (error) {
      console.error("Lỗi khi xóa xe của người dùng:", error);
      res.status(500).send("Lỗi server");
    }
  },
};

module.exports = userController;
