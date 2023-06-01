const init = () => {
    console.log("lllll")
    declereFormEvent()
    // doApi()
}


const declereFormEvent = () =>{
    console.log("login event")
    let id_form_login = document.querySelector("#id_form_login")
    id_form_login.addEventListener("submit", (e)=>{
        e.preventDefault()
        let dataBody = {
            email: document.querySelector("#id_email_login").value,
            password: document.querySelector("#id_password_login").value,
        }
        console.log(dataBody)
        let url ="http://localhost:3000/users/login"
        fetch(url, {
            method: "POST",
            body: JSON.stringify(dataBody),
            headers: {
                'content-type': "application/json"
            }
        })
        .then(resp => resp.json())
        .then(data=>{
            console.log(data)
            if(data.token){
                localStorage.setItem("token", data.token)
                window.location.href = "cakes.html"
            }else{
                alert("User or password wrong")
            }
        })
        // addNewCostumer(dataBody)
    })
}
init()