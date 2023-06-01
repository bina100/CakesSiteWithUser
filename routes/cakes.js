const express = require("express");
const bcrypt = require("bcrypt")
const { UserModel, validateSignIn, validateLogin, genToken } = require("../models/userModel");
const router = express.Router()
const { authToken } = require("../auth/authToken");
const { CakeModel } = require("../models/cakeModel");


//הצגת רשימת עוגות עבור משתמש מסוים
// http://localhost:3000/
// http://localhost:3000/cakes/?perPage=4
// http://localhost:3000/cakes/?page=2&perPage=3
// http://localhost:3000/cakes/?page=2&perPage=3&sort=name
router.get("/", authToken, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 5;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    try {
        let data = await CakeModel
            .find({ user_id: user.id })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.json(data)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

//הצגת רשימת עוגות לכולם  
// http://localhost:3000/
// http://localhost:3000/cakes/?perPage=4
// http://localhost:3000/cakes/?page=2&perPage=3
router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 5;
    let page = req.query.page || 1;
    try {
        let data = await CakeModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({_ןג: -1})
        res.json(data)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "There error try again later", err})
    }
})

// חיפוש בשם העוגה 
// http://localhost:3000/cakes/search?s=w
router.get("/search", authToken, async (req, res) => {
    try {
        let queryS = req.query.s
        let searchReg = new RegExp(queryS, "i")
        let data = await CakeModel.find({ name: searchReg })
            .limit(50)
        res.json(data)
    } catch (err) {
        res.status(500).json({ msg: "err", err })
    }
})
//הוספת עוגה למשתמש מסוים
// http://localhost:3000/cakes
router.post("/", authToken, async (req, res) => {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    let cakeObj = { ...req.body, user_id: user.id }
    if (!user) {
        return res.status(404).json({ msg: "user not found" })
    }
    try {
        let cake = new CakeModel(cakeObj)
        console.log(cake)
        await cake.save()
        res.status(201).json(cake)
    } catch (err) {
        res.status(500).json({ msg: "err", err })
    }
})




//מחיקת עוגה עבור משתמש מסוים
// http://localhost:3000/cakes/64732656c73441cf136e0786
router.delete("/:idDel", authToken, async (req, res) => {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    if (!user) {
        return res.status(404).json({ msg: "you can`t delete cakes from other user" })

    }
    try {
        let idDel = req.params.idDel
        let data = await CakeModel.deleteOne({ _id: idDel })
        res.status(200).json(data)
    } catch {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

//עדכון פרטי עוגה עבור משתמש מסוים
// http://localhost:3000/cakes/646b3b8bc4605a71e3c1a0b2
// ולשלוח את כל הנתנוים
router.put("/:idEdit", authToken, async (req, res) => {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    if (!user) {
        return res.status(404).json({ msg: "you can`t edit cakes from other user" })
    }
    try {
        let idEdit = req.params.idEdit
        let data = await CakeModel.updateOne({ _id: idEdit }, req.body)
        res.json(data)
    } catch {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router