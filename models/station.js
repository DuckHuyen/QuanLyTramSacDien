//station.js

const pool = require("../database/db");

class Station {
  static async findAll() {
    try {
      const query = `
      SELECT 
        ts.matramsac,ts.tentramsac,ts.diachi,ts.giomo,
        ts.giodong,ts.kinhdo,ts.vido,ts.img_url,hx.tenhangxe,
        json_agg(
          json_build_object(
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
      GROUP BY 
        ts.matramsac, ts.tentramsac, ts.diachi, ts.giomo, 
        ts.giodong, ts.kinhdo, ts.vido, ts.img_url, hx.tenhangxe
      ORDER BY ts.matramsac;
    `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching stations: ${error.message}`);
    }
  }
}

module.exports = Station;
