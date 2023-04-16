import ProductManager from "./ProductManager.js";

const productManager = new ProductManager("./products.json");

const context = async () => {
  try {
/*     const getProducts = await productManager.getProducts();
    console.log(getProducts); */
    let testProduct = {
      title: "asfasdasdas",
      description: "asdkjashdak",
      price: 12312,
      thumbnail: "/f:asdsad/asdas",
      code: "21s",
      stock: 2,
    };
/*     await productManager.addProduct(testProduct);
    await productManager.getProductById(1) */
    await productManager.updateProduct(1, {title: "quesito"})
/*         await productManager.deleteProduct(2) */
  } catch (err) {
    console.log(err);
  }
};

context()