//account.js

const pool = require("../database/db");

const AccountModel =  {
  // Hàm tạo người dùng
  async createUser(name, email, password) {
    const query = `
            INSERT INTO nguoidung (tennguoidung, email, matkhau)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    const values = [name, email, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Hàm lấy thông tin người dùng qua email
  async getUserByEmail(email) {
    const query = `
            SELECT * FROM nguoidung WHERE email = $1;
        `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
}

module.exports = AccountModel;
