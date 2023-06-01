import CakeClass from "./cakeClass.js"
import { declereFormEvent } from "./formEvent.js"

const init = () => {
    console.log("lllll")
    // declereFormEvent()
    doApi()
    declereFormEvent(doApi)
}

const doApi = async () => {
    let url = "http://localhost:3000/cakes/?sort=name"
    // try{
    //     let resp = await axios.get(url)
    //     console.log(resp.data)
    //     createTable(resp.data)
    // }catch(err){
    //     console.log(err)    
    //     alert("There problem, come back later.")
    // }

        fetch(url, {
            method: "GET",
            headers: {
                "x-api-key": localStorage["token"],
                'content-type': "application/json"
            }
        })
        .then(resp => resp.json())
        .then(data=>{
            console.log(data)
            createTable(data)
        })
}
const createTable = (_ar) => {
    document.querySelector("#tbody").innerHTML = ""
    _ar.forEach((item, i) => {
        let country = new CakeClass("#tbody", item, i, doApi);
        country.render()
    });
}

init()