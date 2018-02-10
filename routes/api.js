const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('post_office_db', 'root', '**************', {
    host: "localhost",
    dialect: "mysql",

    pool: {
        max: 20,
        min: 1,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(function() {
        console.log("Connection has been established successfully");
    })
    .catch(function(err) {
        console.log("Unable to connect to the database: ", err);
    });

/*define "driver" table*/
const Driver  = sequelize.define('drivers', {
    driver_id: {
        type: Sequelize.INTEGER
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    experience: {
        type: Sequelize.INTEGER
    },
    driver_licence: {
        type: Sequelize.STRING
    },
    deliveries_count: {
        type: Sequelize.INTEGER
    }
});

router.get('/drivers', function(req, res) {
    const driver = Driver.findAll({
            attributes: ['firstName', 'lastName', 'experience', 'driver_licence', 'deliveries_count']
    })
        .then(function(result) {
            res.status(200).json(result);
    })
        .catch(function(error) {
            res.status(500).send(error)
    });
});

/*define "city" table*/
const City = sequelize.define('city', {
    city_id: {
        type: Sequelize.INTEGER
    },
    city_name: {
        type: Sequelize.STRING
    }
},
    {
       tableName: 'city'
});

router.get('/cities', function(req, res) {
    const cities = City.findAll({
        attributes: ['city_id', 'city_name'],
        raw: true
    })
        .then(function(result) {
            res.status(200).json(result)
        })
        .catch(function(error) {
            res.status(500).send(error);
        });
});

const Office = sequelize.define('office', {
    office_id: {
        type: Sequelize.INTEGER
    },
    city_id: {
        type: Sequelize.INTEGER
    },
    office_number: {
        type: Sequelize.INTEGER
    },
    address: {
        type: Sequelize.STRING
    },
    principal: {
        type: Sequelize.STRING
    },
    work_time: {
        type: Sequelize.TIME
    },
    work_time_end: {
        type: Sequelize.TIME
    }
},
    {
        tableName: 'office'
});

router.get('/offices', function(req, res) {
    const offices = Office.findAll({
        attributes: ['office_id', 'office_number', 'city_id', 'address', 'principal', 'work_time', 'work_time_end'],
        raw: true
    })
        .then(function(result) {
            res.status(200).json(result)
    })
        .catch(function(error) {
            res.status(500).send(error)
    });
});

module.exports = router;
