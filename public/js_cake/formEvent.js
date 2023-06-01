
export const declereFormEvent = (_doApi) => {
    let id_form = document.querySelector("#id_form")
    id_form.addEventListener("submit", (e) => {
        e.preventDefault()
        let dataBody = {
            name: document.querySelector("#id_name").value,
            cals: document.querySelector("#id_cals").value,
            price: document.querySelector("#id_price").value,
        }
        console.log(dataBody)
        addNewCake(dataBody, _doApi)
    })
}

const addNewCake = async (_bodyData, _doApi) => {
    let url = "http://localhost:3000/cakes"
    let cake =
        fetch(url, {
            method: "POST",
            body: JSON.stringify(_bodyData),
            headers: {
                "x-api-key": localStorage["token"],
                'content-type': "application/json"
            }
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data)
                alert("Cake added")
                _doApi();
            })

}