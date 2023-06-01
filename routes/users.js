const express = require("express");
const bcrypt = require("bcrypt")
const { UserModel, validateSignIn, validateLogin, genToken } = require("../models/userModel");
const router = express.Router()
const { authToken } = require("../auth/authToken")

// http://localhost:3000/
// http://localhost:3000/users/?perPage=4
// http://localhost:3000/users/?page=2&perPage=3
// http://localhost:3000/users/?page=2&perPage=3&sort=name
router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 5;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await UserModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.json(data)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


// http://localhost:3000/users/userInfo
router.get("/userInfo", authToken, async (req, res) => {
    //    res.json({msg: "all good after the auth middleware"})
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    res.json(user)


})

// http://localhost:3000/users
router.post("/", async (req, res) => {
    let validBody = validateSignIn(req.body)

    if (validBody.error) {
        return res.status(404).json(validBody.error.details)
    }
    try {
        let user = new UserModel(req.body)
        user.password = await bcrypt.hash(user.password, 10);

        await user.save()
        user.password = "******"
        res.status(201).json(user)
    } catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({ msg: "Email is alredy in system try login", code: 11000 })
        }
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// http://localhost:3000/users/login
router.post("/login", async (req, res) => {
    let valdiateBody = validateLogin(req.body);
    if (valdiateBody.error) {
        return res.status(400).json(valdiateBody.error.details)
    }
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ msg: "user and password not match 1" })
        }
        let validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ msg: "user and password not match 2" })
        }
        let newToken = genToken(user.id)
        res.json({ token: newToken });

    }
    catch (err) {

        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


// http://localhost:3000/users/646b3a45c4605a71e3c1a0af
router.delete("/:idDel", async (req, res) => {
    try {
        let idDel = req.params.idDel
        let data = await UserModel.deleteOne({ _id: idDel })
        res.status(200).json(data)
    } catch {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// http://localhost:3000/users/646b3b8bc4605a71e3c1a0b2
// ולשלוח את כל הנתנוים
router.put("/:idEdit", async (req, res) => {
    let validBody = validateSignIn(req.body)

    if (validBody.error) {
        return res.status(400).json(validBody.error.details)
    }
    try {
        let idEdit = req.params.idEdit
        let data = await UserModel.updateOne({ _id: idEdit }, req.body)
        res.json(data)
    } catch {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router