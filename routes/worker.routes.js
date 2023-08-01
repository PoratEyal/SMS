const express = require('express');
const workerRouter = express.Router();
const Role = require('../models/role');
const User = require('../models/user');
const Shift = require('../models/shift');
const Day = require('../models/day');
const Week = require('../models/week');
const job = require('../models/job');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { parse } = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const functions = require('../utils/functions');
const { Job } = require('node-schedule');
const ObjectId = mongoose.Types.ObjectId;

workerRouter.use(bodyParser.json());

// delete worker from workers list
workerRouter.put('/removeWorkerFromWorkrs', (req, res) => {
    const body = req.body;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate(
        { "day._id": dayId, "day.shifts._id": shiftId },
        {
            $pull: { "day.$.shifts.$[elem].workers": workerId },
            //$push: { "day.$.shifts.$[elem].availableWorkers": workerId }
        },
        { arrayFilters: [{ "elem._id": shiftId }], projection: { "day.$": 1 } })
        .then(() => {
            Week.findOne({ "day._id": dayId }, { "day.$": 1 }).then(response => {
                if (response && response.day && response.day.length > 0) {
                    res.status(200).json(response.day[0]);
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

// working one !!!!!
// add worker to avialible workers list
workerRouter.put('/addWorkerToAvial', (req, res) => {
    const body = req.body;
    const managerId = body.managerId;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate(
        { "day._id": dayId, "day.shifts._id": shiftId, "ofManager": managerId },
        { $push: { "day.$.shifts.$[elem].availableWorkers": workerId } },
        { arrayFilters: [{ "elem._id": shiftId }], returnOriginal: true }
    ).then(response => {
        res.status(200).json(response);
    });    
});

// working one !!!!!
// delete worker to avialible workers list
workerRouter.put('/delWorkerToAvial', (req, res) => {
    const body = req.body;
    const managerId = body.managerId;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate({ "day._id": dayId, "day.shifts._id": shiftId, "ofManager": managerId },
        {
            $pull: { "day.$.shifts.$[elem].availableWorkers": workerId }
        },
        { arrayFilters: [{ "elem._id": shiftId }] }).then(response => {
            res.status(200).json(response);
        });
});



// working one!!!!!
// add worker to workers list
workerRouter.put('/addWorkerToWorkrs', (req, res) => {
    const body = req.body;
    const managerId = body.managerId;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate(
        { "day._id": dayId, "day.shifts._id": shiftId, ofManager: managerId },
        {
            $push: { "day.$.shifts.$[elem].workers": workerId },
        },
        { arrayFilters: [{ "elem._id": shiftId }], projection: { "day.$": 1 } }
    )
        .then(() => {
            Week.findOne({ "day._id": dayId, ofManager: managerId }, { "day.$": 1 })
                .then(response => {
                    if (response && response.day && response.day.length > 0) {
                        res.status(200).json(response.day[0]);
                    }
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while adding the worker shift." });
        });
});
// add worker to workers list
// workerRouter.put('/addWorkerToWorkrs', (req, res) => {
//     const body = req.body;
//     const dayId = body.dayId;
//     const shiftId = body.shiftId;
//     const workerId = body.workerId;

//     Week.findOneAndUpdate({ "day._id": dayId, "day.shifts._id": shiftId },
//         {
//             $push: { "day.$.shifts.$[elem].workers": workerId },
//             $pull: { "day.$.shifts.$[elem].availableWorkers": workerId }
//         },
//         { arrayFilters: [{ "elem._id": shiftId }], projection: { "day.$": 1 } })
//         .then(() => {

//             Week.findOne({ "day._id": dayId }, { "day.$": 1 }).then(response => {
//                 if (response && response.day && response.day.length > 0) {
//                     res.status(200).json(response.day[0]);
//                 }
//             });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });


// working one!!!!!
// add worker to avialible workers list
workerRouter.put('/WorkersToAvail', (req, res) => {
    const body = req.body;
    const managerId = body.managerId; // Retrieve managerId from the request body
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate(
        { "day._id": dayId, "day.shifts._id": shiftId, ofManager: managerId }, // Include 'ofManager' to filter by managerId
        {
            $pull: { "day.$.shifts.$[elem].workers": workerId },
            //$push: { "day.$.shifts.$[elem].availableWorkers": workerId }
        },
        { arrayFilters: [{ "elem._id": shiftId }], projection: { "day.$": 1 } }
    )
        .then(() => {
            Week.findOne({ "day._id": dayId, ofManager: managerId }, { "day.$": 1 })
                .then(response => {
                    if (response && response.day && response.day.length > 0) {
                        res.status(200).json(response.day[0]);
                    }
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while removing the worker shift." });
        });
});
//add worker to avialible workers list
// workerRouter.put('/WorkersToAvail', (req, res) => {
//     const body = req.body;
//     const dayId = body.dayId;
//     const shiftId = body.shiftId;
//     const workerId = body.workerId;

//     Week.findOneAndUpdate(
//         { "day._id": dayId, "day.shifts._id": shiftId },
//         {
//             $pull: { "day.$.shifts.$[elem].workers": workerId },
//             //$push: { "day.$.shifts.$[elem].availableWorkers": workerId }
//         },
//         { arrayFilters: [{ "elem._id": shiftId }], projection: { "day.$": 1 } })
//         .then(() => {
//             Week.findOne({ "day._id": dayId }, { "day.$": 1 }).then(response => {
//                 if (response && response.day && response.day.length > 0) {
//                     res.status(200).json(response.day[0]);
//                 }
//             });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });


module.exports = workerRouter