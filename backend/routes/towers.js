let TowerModel = require('./../models/tower');
let express = require('express');
let router = express.Router();

router.get('/towers', (req, res) => {
    TowerModel.find((err, towers) => {
        if (err) {
            res.status(500).send({ error: "Server error" });
            return;
        }
        res.json(towers);
    });
});

router.post('/towers', (req, res) => {
    try {
        const tower = new TowerModel({
            x: req.body.x,
            y: req.body.y,
            name: req.body.name.replace(/[^a-z\d ]/gi, ''),
            kingdom: req.body.kingdom.replace(/[^a-z]/gi, ''),
            ql: req.body.ql,
            capital: false
        });

        tower.save(function (err, t) {
            if (err) {
                res.status(400).send({ error: "Bad request" });
                return;
            }
            console.log(`Inserting new tower ${t.name}(${t.kingdom}) at (${t.x},${t.y})`)

            res.json(t);
        });
    } catch {
        console.log("Error");
        res.status(400).send({ error: 'Bad request' });
    }

});

router.get('/towers/:id', (req, res) => {
    try {
        const tower = TowerModel.findOne({ _id: req.params.id }, function (err, t) {
            res.send(t);
        })
    } catch {
        res.status(404).send({ error: "Tower doesn't exist" });
    }
});

router.patch('/towers/:id', (req, res) => {
    try {
        console.log(`Updating tower ${req.params.id}`);
        const tower = TowerModel.findOne({ _id: req.params.id }, function (err, t) {
            try {
                if (req.body.name) {
                    t.name = req.body.name.replace(/[^a-z\d ]/gi, '');
                }
                if (req.body.num) {
                    t.num = req.body.num;
                }
                if (req.body.kingdom) {
                    t.kingdom = req.body.kingdom.replace(/[^a-z]/gi, '');
                }
                if (req.body.ql) {
                    t.ql = req.body.ql;
                }
                t.save();
                res.send(t);
            }
            catch {
                console.log("Error updating tower");
            }
        })
    } catch {
        res.status(404).send({ error: "Tower doesn't exist" });
    }
});


router.delete('/towers/:id', (req, res) => {
    try {
        const tower = TowerModel.deleteOne({ _id: req.params.id }, function (err, t) {
            if (err) {
                res.status(404).send({ error: "Tower doesn't exist" });
            }
            console.log(`Deleting tower ${req.params.id}`);
            res.status(204).send();
        });

    } catch {
        res.status(404).send({ error: "Tower doesn't exist" });
    }
});

module.exports = router;