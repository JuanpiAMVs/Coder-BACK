import { faker } from "@faker-js/faker/locale/es";

export const generateProducts = () => {
  return {
    product: faker.commerce.product(),
    description: faker.commerce.productAdjective(),
    thumbnail: [],
    code: faker.string.alphanumeric(100),
    stock: faker.number.int({ max: 35 }),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
  };
};