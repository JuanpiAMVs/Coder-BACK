const form = document.getElementById("restoreRequestForm")
const text = document.getElementById('message')

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {}
    data.forEach((value,key) => (obj[key] = value));
    console.log(obj)
    const response = await fetch('/api/sessions/restoreRequest', {
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const responsedata = await response.json()
    if(responsedata.status === "success"){
        text.innerHTML = "Se ha enviado un correo de verificación"
    } else{
        console.log(responsedata.error)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: responsedata.error,
          })
    }
    console.log(responsedata.error)
})