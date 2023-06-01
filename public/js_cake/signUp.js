const init = () => {
    console.log("lllll")
    declereFormEvent()
}


const declereFormEvent = () =>{
    console.log("login event")
    let id_form_sign_up = document.querySelector("#id_form_sign_up")
    id_form_sign_up.addEventListener("submit", (e)=>{
        e.preventDefault()
        let dataBody = {
            name: document.querySelector("#id_name").value,
            email: document.querySelector("#id_email").value,
            password: document.querySelector("#id_password").value,
        }
        console.log(dataBody)
        console.log("hhh")

        addNewUser(dataBody)
    })
}

const addNewUser = async(_bodyData) =>{
    let myUrl = "http://localhost:3000/users"
    try{
        let resp = await axios({
            url: myUrl,
            method: "POST",
            data: JSON.stringify(_bodyData),
            headers:{
                'Content-Type': "application/json"
            }
        })
        if (resp.data._id) {
            alert("user added")
            window.location.href = "signIn.html"
        }
        else {
            alert("There problem, try again")
        }
    }
    catch (err) {
        alert(err.response.data.msg || err.response.data[0].message);
    }

}
init()