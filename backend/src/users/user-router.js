const express = require('express');
const router = express.Router();
const User = require('./user-controller');
const obj = new User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//register user
router.post('/', async (req, res) => {
    //hashing password
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        // Now we can store the password hash in db.
        let result = await obj.insert(req.body, hash);
        if (result) {
            return res.status(200).json('Registered successfully');
        } else {
            return res.status(501).json({
                msg: "Email already exist, Please try again"
            });
        }
    });
})

//get User role to on sign in
router.post('/getUserRole', async (req, res) => {
    let email = req.body.email;
    let result = await obj.findUser(email);
    if (result) {
        return res.status(200).json(result);
    } else {
        return res.status(501).json({
            msg: "Email doesn't exist, Please try again"
        });
    }
});

//verify user and genrate Token
router.post('/login', async (req, res) => {
    let email = req.body.email;
    console.log(email);
    let pass = req.body.password;
    console.log(pass);
    let result = await obj.findUserToLogin(email,pass);
    if (result) {
        let token = jwt.sign({
            data: result
        }, 'secret', {
            expiresIn: '24h'
        });
        return res.status(200).json(token);
    } else {
        return res.status(501).json({
            msg: "User doesn't exist, Please try again"
        });
    }
});

//get user data on dashboard
router.post('/dashboard', verifyToken, async (req, res) => {
    let id = decodedData.data.id;
    let result = await obj.findUserById(id);
    return res.status(200).json(result)
})

decodedData = '';
//verifing token
function verifyToken(req, res, next) {
    let token = req.body.token;
    jwt.verify(token, 'secret', (err, data) => {
        if (data) {
            decodedData = data;
            next();
        }
        if (err) {
            return res.status(501).json('Not verified');
        }
    })
}

//render user data into edit form
router.get('/edit', async (req, res) => {
    let id = req.query.id;
    let result = await obj.findUserById(id);
    if (result) {
        return res.status(200).json(result)
    } else {
        return res.status(501).json('Internal error');
    }
})
//save user edited details
router.put('/editData', obj.updateDetails, async (req, res) => {
    res.status(200).json('Updated successfully');
})

//Get all users from db
router.get('/', async (req, res) => {
    // Find all users
    let data = await obj.getAllUser()
    if (data) {
        res.status(200).json({'details':data, status: 1});
    } else {
        res.status(501).json({
            msg: 'No Users found'
        })
    }
});

//Count total users
router.get('/countTotal', async (req, res) => {
    // Find all users
    let data = await obj.countTotalUsers()
    console.log(data);
    res.status(200).json(data);

});

//Count active users
router.get('/activeTotal', async (req, res) => {
    // Find all active users
    let data = await obj.countActiveUsers()
    console.log(data);
    res.status(200).json(data);

});

//Count deactive users
router.get('/deactiveTotal', async (req, res) => {
    // Find all users
    let data = await obj.countDeactiveUsers()
    res.status(200).json(data);

});

//delete User
router.delete('/', async (req, res) => {
    id = req.query.id;
    let data = await obj.deleteUser(id)
    if (data) {
        res.status(200).json('Deleted successfully');
    } else {
        res.status(501).json({
            msg: 'Error in deletion'
        })
    }
})

//deactivate User
router.put('/', async (req, res) => {
    id = req.query.id;
    let data = await obj.deactivateUser(id)
    if (data) {
        res.status(200).json('Deactivate successfully');
    } else {
        res.status(501).json({
            msg: 'Error in deletion'
        })
    }
})

router.get('/validAdmin', async (req, res) => {
    let email = req.query.email;
    console.log(email);
    let data = await obj.validAdmin(email);
    console.log(data);
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(501).json({
            msg: 'Your email is incorrect'
        })
    }
})

//save user details edited by admin
router.put('/editDetails', async (req, res) => {
    let data = await obj.saveDetails(req.body)
    if (data) {
        res.status(200).json('Updated successfully');
    } else {
        res.status(501).json({
            msg: 'Error in updating data'
        })
    }
})

module.exports = router;