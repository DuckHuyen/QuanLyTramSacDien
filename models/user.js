// models/user.js
const stationModel = require("../models/station");

const pool = require("../database/db");

const userModel = {
  async getUserInfoWithCar(userId) {
    try {
      const query = `
        SELECT 
          u.manguoidung,
          u.tennguoidung,
          u.email,
          u.maxe,
          x.tenxe,
          x.mahangxe,
          hx.tenhangxe,
          json_agg(cs.machuansac) as chuansac_xe
        FROM nguoidung u
        LEFT JOIN xe x ON u.maxe = x.maxe
        LEFT JOIN hangxe hx ON x.mahangxe = hx.mahangxe
        LEFT JOIN chuansacxe csx ON x.maxe = csx.maxe
        LEFT JOIN chuansac cs ON csx.machuansac = cs.machuansac
        WHERE u.manguoidung = $1
        GROUP BY u.manguoidung, u.tennguoidung, u.email, u.maxe, x.tenxe, x.mahangxe, hx.tenhangxe;
      `;
      const result = await pool.query(query, [userId]);
      return result.rows[0]; // Trả về thông tin người dùng và xe (nếu có)
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  async getStationsByCar(maHangXe, chuanSacXe) {
    try {
      // Lấy danh sách các trạm cùng hãng xe
      const compatibleStationsQuery = `
      SELECT 
        ts.matramsac,
        ts.tentramsac,
        ts.diachi,
        ts.giomo,
        ts.giodong,
        ts.kinhdo,
        ts.vido,
        ts.img_url,
        hx.tenhangxe,
        json_agg(
          DISTINCT jsonb_build_object(
            'loaisac', cs.loaisac,
            'congsuattoithieu', cs.congsuattoithieu,
            'congsuattoida', cs.congsuattoida,
            'soluong', cst.soluong
          )
        ) AS chuansac_info
      FROM tramsac ts
      JOIN hangxe hx ON ts.mahangxe = hx.mahangxe
      JOIN chuansactram cst ON ts.matramsac = cst.matram
      JOIN chuansac cs ON cst.machuansac = cs.machuansac
      WHERE ts.mahangxe = $1 AND cst.machuansac = ANY($2::int[])
      GROUP BY ts.matramsac, ts.tentramsac, ts.diachi, ts.giomo, ts.giodong, ts.kinhdo, ts.vido, ts.img_url, hx.tenhangxe;
    `;

      const compatibleStationsResult = await pool.query(
        compatibleStationsQuery,
        [maHangXe, chuanSacXe]
      );

      const compatibleStationIds = new Set(
        compatibleStationsResult.rows.map((station) => station.matramsac)
      );

      const allStations = await stationModel.findAll();
      const compatibleStations = allStations.filter((station) =>
        compatibleStationIds.has(station.matramsac)
      );
      const otherStations = allStations.filter(
        (station) => !compatibleStationIds.has(station.matramsac)
      );

      return {
        compatibleStations,
        otherStations,
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách trạm sạc:", error);
      throw error;
    }
  },

  async getUserCars(userId) {
    try {
      const query = `
            SELECT x.*, hx.tenhangxe
            FROM xesohuu xs
            JOIN xe x ON xs.maxe = x.maxe
            JOIN hangxe hx ON x.mahangxe = hx.mahangxe
            WHERE xs.manguoidung = $1;
        `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xe của người dùng:", error);
      throw error;
    }
  },

  async updateUserCar(userId, carId) {
    try {
      const query = `
            UPDATE nguoidung
            SET maxe = $2
            WHERE manguoidung = $1;
        `;
      await pool.query(query, [userId, carId]);
    } catch (error) {
      console.error("Lỗi khi cập nhật xe cho người dùng:", error);
      throw error;
    }
  },

  async addUserCar(userId, carId) {
    try {
      const query = `
            INSERT INTO xesohuu (manguoidung, maxe)
            VALUES ($1, $2);
        `;
      await pool.query(query, [userId, carId]);
    } catch (error) {
      console.error("Lỗi khi thêm xe cho người dùng:", error);
      throw error;
    }
  },
  async deleteUserCar(userId, carId) {
    try {
      const query = `
            DELETE FROM xesohuu
            WHERE manguoidung = $1 AND maxe = $2;
        `;
      await pool.query(query, [userId, carId]);
    } catch (error) {
      console.error("Lỗi khi xóa xe của người dùng:", error);
      throw error;
    }
  },
};

module.exports = userModel;
