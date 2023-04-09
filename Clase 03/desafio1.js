class ProductManager {
    constructor(){
        this.products= []
    }

    addProduct(title, description, price, thumbnail, code, stock){
        if(!title || !description || !price || !thumbnail || !code ||!stock ){
            console.log("Faltan argumentos al agregar producto")
            return
        }
        const product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }
        const findCode = this.products.find((obj) => obj.code === code)
            if (findCode){
                console.log(`El codigo ${findCode.code} ya se encuentra ocupado`)
            }else{
                product.id = this.products.length > 0 ? this.products[this.products.length-1].id + 1 : 1
                this.products.push(product)
                console.log("Producto agregado")
            }
        }
        

        getProducts(){
            console.log(this.products)
            return this.products
        }
    
        getProductById(id){
            const filter = this.products.filter(e => e.id===id)
            if(filter.length == 0) console.log(`id ${id} Not found `)
            return filter
        }
    
    }

let productos = new ProductManager()
productos.addProduct("mondongo","asdkjashdak", 12312, "/f:asdsad/asdas", "21a" )
productos.getProducts()