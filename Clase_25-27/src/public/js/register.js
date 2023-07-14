const form = document.getElementById("registerForm")

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {}
    data.forEach((value,key) => (obj[key] = value));
    console.log(obj)
    const response = await fetch('/api/sessions/register', {
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const responsedata = await response.json()
    if(responsedata.status === "success"){
        //redirijo al login
        window.location.replace('/login')
    }else{
        console.log(responsedata.error)
    }

})