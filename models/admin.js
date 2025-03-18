// adminModel.js
const pool = require("../database/db");

const adminModel = {
  // Chuẩn sạc operations
  async getAllChuanSac() {
    const query = "SELECT * FROM ChuanSac ORDER BY MaChuanSac";
    const result = await pool.query(query);
    return result.rows;
  },

  async createChuanSac(loaiSac, congSuatToiThieu, congSuatToiDa) {
    const query =
      "INSERT INTO ChuanSac (LoaiSac, CongSuatToiThieu, CongSuatToiDa) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(query, [
      loaiSac,
      congSuatToiThieu,
      congSuatToiDa,
    ]);
    return result.rows[0];
  },

  async deleteChuanSac(id) {
    try {
      await pool.query("DELETE FROM chuansac WHERE machuansac = $1", [id]);
    } catch (err) {
      throw err;
    }
  },

  // Trạm sạc operations
  async createTramSac(tramSacData, chuanSacList) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert trạm sạc
      const tramSacQuery = `
        INSERT INTO TramSac (MaHangXe, MaKhuVuc, TenTramSac, DiaChi, GioMo, GioDong, KinhDo, ViDo, Img_Url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING MaTramSac`;
      const tramSacResult = await client.query(tramSacQuery, [
        tramSacData.maHangXe,
        tramSacData.maKhuVuc,
        tramSacData.tenTramSac,
        tramSacData.diaChi,
        tramSacData.gioMo,
        tramSacData.gioDong,
        tramSacData.kinhDo,
        // adminModel.js
        tramSacData.viDo,
        tramSacData.imgUrl,
      ]);

      const maTramSac = tramSacResult.rows[0].matramsac;

      // Insert chuẩn sạc cho trạm
      for (const chuanSac of chuanSacList) {
        await client.query(
          "INSERT INTO ChuanSacTram (MaTram, MaChuanSac, SoLuong) VALUES ($1, $2, $3)",
          [maTramSac, chuanSac.maChuanSac, chuanSac.soLuong]
        );
      }

      await client.query("COMMIT");
      return tramSacResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async deleteTramSac(id) {
    try {
      await pool.query("DELETE FROM tramsac WHERE matramsac = $1", [id]);
    } catch (err) {
      throw err;
    }
  },

  async updateTramSac(tramId, tramSacData, chuanSacList) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update thông tin trạm sạc
      const tramSacUpdateQuery = `
UPDATE TramSac
SET MaHangXe = $1, MaKhuVuc = $2, TenTramSac = $3, DiaChi = $4, GioMo = $5, GioDong = $6, KinhDo = $7, ViDo = $8, Img_Url = $9
WHERE MaTramSac = $10`;
      await client.query(tramSacUpdateQuery, [
        tramSacData.maHangXe,
        tramSacData.maKhuVuc,
        tramSacData.tenTramSac,
        tramSacData.diaChi,
        tramSacData.gioMo,
        tramSacData.gioDong,
        tramSacData.kinhDo,
        tramSacData.viDo,
        tramSacData.imgUrl,
        tramId,
      ]);

      // Xóa các chuẩn sạc cũ của trạm
      await client.query("DELETE FROM ChuanSacTram WHERE MaTram = $1", [
        tramId,
      ]);

      // Thêm các chuẩn sạc mới cho trạm
      for (const chuanSac of chuanSacList) {
        await client.query(
          "INSERT INTO ChuanSacTram (MaTram, MaChuanSac, SoLuong) VALUES ($1, $2, $3)",
          [tramId, chuanSac.maChuanSac, chuanSac.soLuong]
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // Thành phố operations
  async getAllThanhPho() {
    const query = "SELECT * FROM ThanhPho ORDER BY MaThanhPho";
    const result = await pool.query(query);
    return result.rows;
  },

  async getKhuVucByThanhPho(maThanhPho) {
    const query =
      "SELECT * FROM KhuVuc WHERE MaThanhPho = $1 ORDER BY MaKhuVuc";
    const result = await pool.query(query, [maThanhPho]);
    return result.rows;
  },

  // Hãng xe operations
  async getAllHangXe() {
    const query = "SELECT * FROM HangXe ORDER BY MaHangXe";
    const result = await pool.query(query);
    return result.rows;
  },

  async createHangXe(tenHangXe) {
    const query = "INSERT INTO HangXe (TenHangXe) VALUES ($1) RETURNING *";
    const result = await pool.query(query, [tenHangXe]);
    return result.rows[0];
  },
  async deleteHangXe(id) {
    try {
      await pool.query("DELETE FROM hangxe WHERE mahangxe = $1", [id]);
    } catch (err) {
      throw err;
    }
  },

  // Xe operations
  async getAllXe() {
    const query = `
SELECT Xe.*, HangXe.TenHangXe 
FROM Xe 
JOIN HangXe ON Xe.MaHangXe = HangXe.MaHangXe
ORDER BY MaXe;
`;
    const result = await pool.query(query);
    return result.rows;
  },

  async createXe(maHangXe, tenXe, chuanSacList) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert xe
      const xeQuery =
        "INSERT INTO Xe (MaHangXe, TenXe) VALUES ($1, $2) RETURNING *";
      const xeResult = await client.query(xeQuery, [maHangXe, tenXe]);
      const maXe = xeResult.rows[0].maxe;

      // Insert chuẩn sạc cho xe
      for (const maChuanSac of chuanSacList) {
        await client.query(
          "INSERT INTO ChuanSacXe (MaXe, MaChuanSac) VALUES ($1, $2)",
          [maXe, maChuanSac]
        );
      }

      await client.query("COMMIT");
      return xeResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async deleteXe(id) {
    try {
      await pool.query("DELETE FROM xe WHERE maxe = $1", [id]);
    } catch (err) {
      throw err;
    }
  },

  async getChuanSacByXe(maXe) {
    const query = `
SELECT cs.* 
FROM ChuanSacXe csx
JOIN ChuanSac cs ON csx.MaChuanSac = cs.MaChuanSac
WHERE csx.MaXe = $1
`;
    const result = await pool.query(query, [maXe]);
    return result.rows;
  },
};

module.exports = adminModel;
