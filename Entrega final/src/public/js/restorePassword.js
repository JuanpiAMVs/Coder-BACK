const form = document.getElementById("restorePasswordForm")
const text = document.getElementById('message')
const urlParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {}
    data.forEach((value,key) => (obj[key] = value));
    obj.token = urlParams.token
    console.log(obj)
    const response = await fetch('/api/sessions/restorePassword', {
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: { 
            "Content-Type": "application/json"
        }
    })
    const responsedata = await response.json()
    if(responsedata.status === "success"){

        text.innerHTML = "Cambiaste tu contraseña!"
    } else{
        Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            title: responsedata.error
          })
    }
    console.log(responsedata.error)
})