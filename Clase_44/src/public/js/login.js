const form = document.getElementById("loginForm")

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {}
    data.forEach((value,key) => (obj[key] = value));
    console.log(obj)
    const response = await fetch('/api/sessions/login', {
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const responsedata = await response.json()
    if(responsedata.status === "success"){
        console.log(responsedata)
        window.location.replace('/products')
    } else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: responsedata.error,
          })
    }
    console.log(responsedata.error)
})