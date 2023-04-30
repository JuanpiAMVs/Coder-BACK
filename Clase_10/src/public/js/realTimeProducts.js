const socket = io();

const form = document.getElementById("msform");
const form2 = document.getElementById("msform2")


form.addEventListener("submit", event => {
    event.preventDefault();
    const title = document.getElementById('addTitle').value
    const description = document.getElementById('addDescription').value
    const price =  document.getElementById('addPrice').value
    const stock =  document.getElementById('addStock').value
    const code = document.getElementById('addCode').value
    const status =  document.getElementById('addStatus').value
    const category =  document.getElementById('addCategory').value
    const thumbnails =  document.getElementById('addThumbnails').value
    const product = {
        title,
        description,
        price,
        stock,
        code,
        status,
        category,
        thumbnails
    }
    console.log(product)
    socket.emit('newProduct', product);
    form.reset(); // para resetear el formulario después de enviarlo
});


socket.on('addProduct', data => {
    const grid = document.getElementById("grid")
let product = ""
    product +=         `<div class="product">
        <div class="product--card">
          <a class="product--image" href="#" title="View">
            <img class="img-responsive" src="${data.thumbnails}">
            <span class="tags">  
            </span>
          </a>
          <a class="product--title" href="#" title="View">${data.title}</a>
          <div class="product--brand">
            <a href="#" title="View">${data.description}</a>
          </div>
            <span class="product--price">Category: ${data.category}</span>
            <span class="product--stock">Stock<b> ${data.stock}</b></span>
          <p>
            <span class="propiedades">ID: ${data.id}</span>
            <span class="propiedades">Code: ${data.code}</span>
            <span class="propiedades">Status: ${data.status}</span>
          </p>
          <a class="product--price" href="#" title="View">
            <span class="product--price-inner">
                    <div class="price--sell-price">${data.price}</div>
        
            </span>
          </a>
        </div>
      </div>`

      grid.innerHTML += product
})
socket.on('products', data => {
    const grid = document.getElementById("grid")
    let productos = ""
        console.log(`productos ${data}`)
        data.forEach(product => {
            productos +=
            `<div class="product">
            <div class="product--card">
              <a class="product--image" href="#" title="View">
                <img class="img-responsive" src="${product.thumbnails}">
                <span class="tags">  
                </span>
              </a>
              <a class="product--title" href="#" title="View">${product.title}</a>
              <div class="product--brand">
                <a href="#" title="View">${product.description}</a>
              </div>
                <span class="product--price">Category: ${product.category}</span>
                <span class="product--stock">Stock<b> ${product.stock}</b></span>
              <p>
                <span class="propiedades">ID: ${product.id}</span>
                <span class="propiedades">Code: ${product.code}</span>
                <span class="propiedades">Status: ${product.status}</span>
              </p>
              <a class="product--price" href="#" title="View">
                <span class="product--price-inner">
                        <div class="price--sell-price">${product.price}</div>
            
                </span>
              </a>
            </div>
          </div>`
        });
        grid.innerHTML = productos
    })


form2.addEventListener("submit", event => {
        event.preventDefault();
        const id = document.getElementById("id").value
        console.log(id)
        socket.emit('deleteProduct', id);
        form.reset(); // para resetear el formulario después de enviarlo
    });

