const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('post_office_db', 'root', 'password', {
    host: "localhost",
    dialect: "mysql",

    pool: {
        max: 200,
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
/** -----------------------Models------------------------- **/
const User = sequelize.define('user', {
        user_id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING
        },
        e_mail: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        age: {
            type: Sequelize.INTEGER
        }
    },
    {
        tableName: 'user'
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

const Statement = sequelize.define('statement', {
        statement_id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        product_name: {
            type: Sequelize.STRING
        },
        weight: {
            type: Sequelize.INTEGER
        },
        storage_conditions: {
            type: Sequelize.STRING
        },
        count: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING
        },
        shipping_city: {
            type: Sequelize.STRING
        },
        shipping_address: {
            type: Sequelize.STRING
        },
        delivery_city: {
            type: Sequelize.STRING
        },
        delivery_address: {
            type: Sequelize.STRING
        },
    },
    {
        tableName: 'statement'
    });


/**---------------------------------routes--------------------------------**/
router.post('/users', function(req, res) {
    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        phone_number: req.body.phone_number,
        status: 'user',
        e_mail: req.body.e_mail,
        password: req.body.password,
        gender: req.body.gender,
        age: req.body.age
    })
        .then(function(result) {
            res.json(result)
        })
        .catch(function(error) {
            res.status(500).send(error)
        });
});

router.post('/moder', function(req, res) {
    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        phone_number: req.body.phone_number,
        status: 'moderator',
        e_mail: req.body.e_mail,
        password: req.body.password,
        gender: req.body.gender,
        age: req.body.age
    })
        .then(function(result) {
            res.json(result)
        })
        .catch(function(error) {
            res.status(500).send(error)
        });
});

router.get('/users', function(req, res) {
    User.findAll({
        attributes: ['user_id', 'first_name', 'last_name', 'username', 'status', 'e_mail', 'age', 'createdAt']
    })
        .then(function(result) {
            res.status(200).json(result)
        })
        .catch(function(error) {
            res.status(500).send(error);
        })
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

router.get('/cities', function(req, res) {
    City.findAll({
        attributes: ['city_id', 'city_name'],
    })
        .then(function(result) {
            res.status(200).json(result)
        })
        .catch(function(error) {
            res.status(500).send(error);
        });
});



router.get('/offices', function(req, res) {
    console.log(req.query);
    Office.findAll({
        attributes: ['office_id', 'office_number', 'city_id', 'address', 'principal', 'work_time', 'work_time_end'],
        where: {
            city_id: req.query.value
        }
    })
        .then(function(result) {
            res.status(200).json(result)
    })
        .catch(function(error) {
            res.status(500).send(error)
    });
});

router.post('/authenticate', function(req, res) {
    User.findOne({
        where: {
            e_mail: req.body.e_mail,
            password: req.body.password
        }
    })
        .then(function(result) {
            if (!result.length) {
                console.log('Email or password are incorrect');
                res.status(500);
            }
            res.status(200).json(result);
        })
        .catch(function(error) {
            res.status(500).send(error);
        })
});

router.post('/statements', function(req, res) {
    console.log('req.body', req.body);
   Statement.create({
       user_id: req.body.user_id,
       product_name: req.body.order.product_name,
       weight: req.body.order.weight,
       storage_conditions: req.body.order.storage_conditions,
       count: req.body.order.count,
       status: 'none',
       shipping_city: req.body.order.shipping_city.city_name,
       shipping_address: req.body.order.shipping_address,
       delivery_city: req.body.order.delivery_city.city_name,
       delivery_address: req.body.order.delivery_address,
   })
       .then(function(result) {
           res.status(200).json(result)
       })
       .catch(function(error) {
           res.status(500).send(error);
       });
});

router.get('/statements', function(req, res) {
    Statement.findAll({
        where: {
            status: 'none'
        }
    })
        .then(function (result) {
            res.json(result);
        })
        .catch(function(error) {
            res.status(500).send(error);
        })
});

router.put('/approve/:statement_id', function(req, res) {
    Statement.update({
        status: 'true'
    }, {
        where: {
            statement_id: req.params.statement_id
        }
    })
        .then(function(result) {
            res.json(result);
        })
        .catch(function(error) {
            res.status(500).send(error);

        })
});

router.put('/refuse/:statement_id', function(req, res) {
    Statement.update({
        status: 'false'
    }, {
        where: {
            statement_id: req.params.statement_id
        }
    })
        .then(function(result) {
            res.json(result)
        })
        .catch(function(error) {
            res.status(500).send(error)
        })
});

router.get('/myorder/:user_id', function(req, res) {
   Statement.findAll({
       where: {
           status: 'true',
           user_id: req.params.user_id
       }
   })
       .then(function(result) {
           res.json(result)
       })
       .catch(function(error) {
           res.status(500).send(error)
       })
});

module.exports = router;