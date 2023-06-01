const express = require("express");
const { CountryModel, validateCountry } = require("../models/countryModel");
const { authToken } = require("../auth/authToken");
const router = express.Router()

// http://localhost:3000/countries
// http://localhost:3000/countries/?perPage=4
// http://localhost:3000/countries/?page=2&perPage=3
// http://localhost:3000/countries/?page=2&perPage=3&sort=name
router.get("/", async(req, res)=>{
    let perPage = Math.min( req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    try{
        let data = await CountryModel
        .find({user_id: user._id})
        .limit(perPage)
        .skip((page-1)*perPage)
        .sort({[sort]: reverse})
        res.json(data)

    }catch(err){
        console.log(err)
        res.status(500).json({msg: "err", err})
    }
})

// http://localhost:3000/countries
router.post("/",authToken, async(req, res)=>{
    let validBody = validateCountry(req.body)

    if(validBody.error){
        return res.status(404).json(validBody.error.details)
    }
    try{
        let country = new CountryModel(req.body)
        country.user_id = req.tokenData._id
        await country.save()
        res.status(201).json(country)
    } catch(err){
        console.log(err)
        res.status(500).json({msg: "err",err})
    }
})

// http://localhost:3000/countries/646b3a45c4605a71e3c1a0af
router.delete("/:idDel", async(req, res)=>{
    try{
        let idDel = req.params.idDel
        let data = await CountryModel.deleteOne({_id:idDel, user_id:req.tokenData._id})
        res.status(200).json(data)
    }catch{
        console.log(err)
        res.status(500).json({msg: "err",err})
    }
})

// http://localhost:3000/countries/646b3b8bc4605a71e3c1a0b2
// ולשלוח את כל הנתנוים
router.put("/:idEdit", async(req, res)=>{
    let validBody = validateCountry(req.body)

    if(validBody.error){
        return res.status(400).json(validBody.error.details)
    }
    try{
        let idEdit = req.params.idEdit
        let data = await CountryModel.updateOne({_id: idEdit}, req.body)
        res.json(data)
    } catch{
        console.log(err)
        res.status(500).json({msg: "err", err})
    }
})

module.exports = router