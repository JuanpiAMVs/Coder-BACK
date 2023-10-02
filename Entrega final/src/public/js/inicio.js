const addCartButton = document.querySelectorAll('.addCart')

addCartButton.forEach((button) => {
    button.addEventListener('click', () => {
        const pid = button.dataset.productId;
        const cid = document.getElementById('cid').textContent.trim().substring(6)
        console.log(cid)
        const data = {
            quantity: 1
        }

        fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          })
            .then((response) => {
              return response.json()
            })
            .then(data => {
              if(data.status === "success"){
                alert('Producto agregado al carrito')
              }
            })
            .catch(error => {
              console.error("Error:", error)
            });
    })
})