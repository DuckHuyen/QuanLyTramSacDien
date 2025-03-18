const adminModel = require("../models/admin");
const stationModel = require("../models/station");

const adminController = {
  async renderTramSac(req, res) {
    const [chuanSacs, thanhPhos, hangXes, tramSacs] = await Promise.all([
      adminModel.getAllChuanSac(),
      adminModel.getAllThanhPho(),
      adminModel.getAllHangXe(),
      stationModel.findAll(),
    ]);
    res.render("admin/tramsac", {
      body: "Trạm Sạc",
      chuanSacs,
      thanhPhos,
      hangXes,
      tramSacs,
    });
  },

  async renderChuanSac(req, res) {
    const chuanSacs = await adminModel.getAllChuanSac();
    res.render("admin/chuansac", {
      body: "Chuẩn Sạc",
      chuanSacs,
    });
  },

  // Chuẩn sạc controllers
  async createChuanSac(req, res) {
    try {
      const { loaiSac, congSuatToiThieu, congSuatToiDa } = req.body;
      await adminModel.createChuanSac(loaiSac, congSuatToiThieu, congSuatToiDa);
      req.flash("info", "Thêm chuẩn sạc thành công");
      res.redirect("/admin/chuansac"); // Sửa lại redirect
    } catch (error) {
      console.error("Error creating chuan sac:", error);
      req.flash("info", "Có lỗi xảy ra khi thêm chuẩn sạc");
      res.redirect("/admin/chuansac"); // Sửa lại redirect
    }
  },

  async deleteChuanSac(req, res) {
    const id = req.params.id;
    try {
      await adminModel.deleteChuanSac(id);
      req.flash("success", "Chuẩn sạc đã được xóa thành công.");
      res.redirect("/admin/chuansac");
    } catch (err) {
      console.error(err);
      req.flash("success", "Chuẩn sạc bị xóa thất bại.");
      res.redirect("/admin/chuansac");
    }
  },

  // Trạm sạc controllers
  async createTramSac(req, res) {
    try {
      const tramSacData = {
        maHangXe: req.body.maHangXe,
        maKhuVuc: req.body.maKhuVuc,
        tenTramSac: req.body.tenTramSac,
        diaChi: req.body.diaChi,
        gioMo: req.body.gioMo,
        gioDong: req.body.gioDong,
        kinhDo: req.body.kinhDo,
        viDo: req.body.viDo,
        imgUrl: req.body.imgUrl,
      };

      const chuanSacs = req.body.chuanSacs || []; // Xử lý trường hợp không có chuẩn sạc nào được chọn
      const soLuongs = req.body.soLuong || []; // Lấy giá trị số lượng tương ứng

      const chuanSacList = chuanSacs.map((maChuanSac, index) => ({
        maChuanSac: maChuanSac,
        soLuong: soLuongs[index], // Lấy số lượng tương ứng với chuẩn sạc
      }));

      await adminModel.createTramSac(tramSacData, chuanSacList);
      req.flash("info", "Thêm trạm sạc thành công");
      res.redirect("/admin");
    } catch (error) {
      console.error("Error creating tram sac:", error);
      req.flash("info", "Có lỗi xảy ra khi thêm trạm sạc");
      res.redirect("/admin/tramsac");
    }
  },

  async deleteTramSac(req, res) {
    const id = req.params.id;
    try {
      await adminModel.deleteTramSac(id);
      req.flash("success", "Trạm sạc đã được xóa thành công.");
      res.redirect("/admin/tramsac");
    } catch (err) {
      console.error(err);
      req.flash("success", "Trạm sạc xóa thất bại.");
      res.redirect("/admin/tramsac");
    }
  },

  // Thành phố controllers
  async createThanhPho(req, res) {
    try {
      const { tenThanhPho } = req.body;
      await adminModel.createThanhPho(tenThanhPho);
      req.flash("info", "Thêm thành phố thành công");
      res.redirect("/admin");
    } catch (error) {
      console.error("Error creating thanh pho:", error);
      req.flash("info", "Có lỗi xảy ra khi thêm thành phố");
      res.redirect("/admin");
    }
  },

  // Khu vực controllers
  async createKhuVuc(req, res) {
    try {
      const { maThanhPho, tenKhuVuc } = req.body;
      await adminModel.createKhuVuc(maThanhPho, tenKhuVuc);
      req.flash("info", "Thêm khu vực thành công");
      res.redirect("/admin");
    } catch (error) {
      console.error("Error creating khu vuc:", error);
      req.flash("info", "Có lỗi xảy ra khi thêm khu vực");
      res.redirect("/admin");
    }
  },

  async getKhuVucByThanhPho(req, res) {
    try {
      const maThanhPho = req.params.maThanhPho;
      const khuVucs = await adminModel.getKhuVucByThanhPho(maThanhPho);
      res.json(khuVucs);
    } catch (error) {
      console.error("Error getting khu vuc:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Hãng xe controllers
  async renderHangXe(req, res) {
    const hangXes = await adminModel.getAllHangXe();
    res.render("admin/hangxe", {
      body: "Hãng Xe",
      hangXes,
    });
  },
  // Hãng xe controllers
  async createHangXe(req, res) {
    try {
      const { tenHangXe } = req.body;
      await adminModel.createHangXe(tenHangXe);
      req.flash("info", "Thêm hãng xe thành công");
      res.redirect("/admin/hangxe");
    } catch (error) {
      console.error("Error creating hang xe:", error);
      req.flash("info", "Có lỗi xảy ra khi thêm hãng xe");
      res.redirect("/admin/hangxe");
    }
  },

  async deleteHangXe(req, res) {
    const id = req.params.id;
    try {
      await adminModel.deleteHangXe(id);
      req.flash("success", "Hãng xe đã được xóa thành công.");
      res.redirect("/admin/hangxe");
    } catch (err) {
      console.error(err);
      req.flash("success", "Hãng xe xóa thất bại.");
      res.redirect("/admin/hangxe");
    }
  },

  async renderXe(req, res) {
    const [xes, hangXes, chuanSacs] = await Promise.all([
      adminModel.getAllXe(),
      adminModel.getAllHangXe(),
      adminModel.getAllChuanSac(),
    ]);

    // Lấy thông tin chuẩn sạc cho từng xe
    for (const xe of xes) {
      xe.chuansac_info = await adminModel.getChuanSacByXe(xe.maxe);
    }

    res.render("admin/xe", {
      body: "Xe",
      xes,
      hangXes,
      chuanSacs,
    });
  },
  // Xe controllers
  async createXe(req, res) {
    try {
      const { maHangXe, tenXe, chuanSacs } = req.body;
      await adminModel.createXe(maHangXe, tenXe, chuanSacs);
      req.flash("info", "Thêm xe thành công");
      res.redirect("/admin/xe");
    } catch (error) {
      console.error("Error creating xe:", error);
      req.flash("info", "Có lỗi xảy ra khi thêm xe");
      res.redirect("/admin/xe");
    }
  },

  async deleteXe(req, res) {
    const id = req.params.id;
    try {
      await adminModel.deleteXe(id);
      req.flash("success", "Xe đã được xóa thành công.");
      res.redirect("/admin/xe");
    } catch (err) {
      console.error(err);
      req.flash("success", "Xe bị xóa thất bại.");
      res.redirect("/admin/xe");
    }
  },
};

module.exports = adminController;
