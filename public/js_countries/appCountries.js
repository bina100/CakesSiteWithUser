import CountryClass from "./countryClass.js"
import { declereFormEvent } from "./formEvent.js"

const init = () => {
    doApi()
    declereFormEvent(doApi)
}

const doApi = async () => {
    // http://localhost:3000/countries/?page=2&perPage=3&sort=name
    let url = "http://localhost:3000/countries/?sort=name"
    try{
        let resp = await axios.get(url)
        console.log(resp.data)
        createTable(resp.data)
    }catch(err){
        console.log(err)    
        alert("There problem, come back later.")
    }
}
const createTable = (_ar) => {
    document.querySelector("#tbody").innerHTML = ""
    _ar.forEach((item, i) => {
        let country = new CountryClass("#tbody", item, i, doApi);
        country.render()
    });
}

init()