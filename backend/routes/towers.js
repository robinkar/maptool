let Tower = require("../models/tower");
let express = require("express");
let towerRouter = express.Router();

towerRouter.get("/", async (req, res) => {
  const towers = await Tower.find({});
  res.json(towers);
});

towerRouter.post("/", async (req, res) => {
  try {
    const tower = new Tower({
      x: req.body.x,
      y: req.body.y,
      name: req.body.name.replace(/[^a-z\d ]/gi, ""),
      kingdom: req.body.kingdom.replace(/[^a-z]/gi, ""),
      ql: req.body.ql,
      capital: false,
    });

    const newTower = await tower.save();

    res.json(tpwer);
    console.log(
      `Inserting new tower ${t.name}(${t.kingdom}) at (${t.x},${t.y})`
    );
  } catch {
    res.status(400).end();
  }
});

towerRouter.get("/:id", async (req, res) => {
  try {
    const tower = await Tower.findOne({ _id: req.params.id });
    res.json(tower);
  } catch {
    res.status(400).end();
  }
});

towerRouter.patch("/:id", async (req, res) => {
  try {
    const tower = {
      name: req.body.name.replace(/[^a-z\d ]/gi, ""),
      num: req.body.num,
      kingdom: req.body.kingdom.replace(/[^a-z]/gi, ""),
      ql: req.body.ql,
    };
    const updatedTower = await Tower.findByIdAndUpdate(req.params.id, tower, {
      new: true,
    });
    res.send(updatedTower);
    console.log(`Updating tower ${req.params.id}`);
  } catch {
    res.status(400).end();
  }
});

towerRouter.delete("/:id", async (req, res) => {
  await Tower.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = towerRouter;
