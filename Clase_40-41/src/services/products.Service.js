export default class ProductsServices{
    constructor(dao){
        this.dao= dao
    }

    getProducts= ()=>{
        return this.dao.getProducts()
    }

    getProductsTo= (param1,param2)=>{
        return this.dao.getProductsTo(param1,param2)
    }

    getProductBy=(pid)=>{
        return this.dao.getProductBy(pid)
    }

    createProduct=(product)=>{
        return this.dao.createProduct(product)
    }

    createProducts=(products)=>{
        return this.dao.createProducts(products)
    }

    updateProduct=(pid, product)=>{
        return this.dao.updateProduct(pid,product)
    }

    paginate = (filters, options) => {
        return this.dao.paginate(filters, options)
    }

    deleteProduct=(pid)=>{
        return this.dao.deleteProduct(pid)
    }
}