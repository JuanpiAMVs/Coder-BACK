export const productsErrorIncompleteValues=(product)=>{
    return(`
    Uno o más parámetros no han sido proporcionados, se esperaba:
    -title: se recibió ${product.title},
    -description: se recibió: ${product.description},
    -price: se recibió: ${product.price},
    -category: se recibió: ${product.category},
    -code: se recibió: ${product.code},
    -stock: se recibió: ${product.stock} ,
    -status: se recibió ${product.stock}
    `)
}

export const productErrorAddProducts = (product) => {
    `No se pudo agregar el producto ${product.title} al carrito`;
  };

export const productErrorDeleteProducts = (product) => {
    `No se pudo eliminar el producto ${product.title}`;
  };