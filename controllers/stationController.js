//stationController.js
const stationModel = require("../models/station");

exports.getAllStations = async (req, res) => {
  try {
    const stations = await stationModel.findAll();
    res.render("index", { stations });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Server error");
  }
};
