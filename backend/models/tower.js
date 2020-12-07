let mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true})

let TowerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    x: {type: Number, required: true},
    y: {type: Number, required: true},
    kingdom: {type: String, required: true},
    ql: {type: Number, default: 1},
    capital: {type: Boolean, default: false}
});
TowerSchema.index({x: 1, y: 1}, {unique: true});

let db = mongoose.connection;

db.once('open', function () {
    console.log("Connected to database");
})

module.exports = mongoose.model('Tower', TowerSchema);