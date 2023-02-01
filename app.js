import express from 'express';
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config()
// creating my express server
const app = express();
const PORT = 7777;

// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// create a schema for the car collection
const DeviceSchema = new mongoose.Schema({
    car_make: String,
    car_model: String,
    car_top_speed: Number,
    car_year_of_manufacture: Number
});

// create a model based on the schema
const Device = mongoose.model('Device', DeviceSchema);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { //this sets the envirnorment
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We're connected to the database <3 <3 !");
});



// create a new device
app.post('/createdevice', async (req, res) => {
    console.log(req.body)
    const device = new Device(req.body);
    try {
        const savedDevice = await device.save();
        res.send(savedDevice);
    } catch (error) {
        res.status(400).send(error);
    }
});

// read all devices
app.get('/getalldevices', async (req, res) => {
    try {
        const devices = await Device.find();
        res.send(devices);
    } catch (error) {
        res.status(400).send(error);
    }
});

// update a specific device
app.patch('/device/:id', async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!device) res.status(404).send('Device not found.');
        res.send(device);
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete a specific device
app.delete('/device/:id', async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) res.status(404).send('Device not found.');
        res.send(device);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send("Hello I am working deployed database with /");
});

app.get('*', (req, res) => {
    res.send("Hello I am working deployed database with *");
});
