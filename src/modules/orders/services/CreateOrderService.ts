import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';

interface IProduct {
   id: string;
   quantity: number;
}

interface IRequest {
   customer_id: string;
   products: IProduct[];
}

class CreateOrderService {
   public async execute({ customer_id, products }: IRequest): Promise<Order> {
      const ordersRepository = getCustomRepository(OrdersRepository);
      const customerRepository = getCustomRepository(CustomersRepository);
      const productRepository = getCustomRepository(ProductRepository);

      const customerExists = await customerRepository.findById(customer_id);

      if (!customerExists) {
         throw new AppError(
            'The customer informed is not registered in your system.',
         );
      }

      const existsproducts = await productRepository.findAllByIds(products);

      if (!existsproducts.length) {
         throw new AppError(
            'None of the informed products is registered in our system.',
         );
      }

      const existsproductsIts = existsproducts.map(product => product.id);

      const checkInexistentProducts = products.filter(
         product => !existsproductsIts.includes(product.id),
      );

      if (checkInexistentProducts.length) {
         throw new AppError(
            `Product ${checkInexistentProducts[0].id} not find.`,
         );
      }

      const quantityAvailable = products.filter(
         product =>
            existsproducts.filter(p => p.id === product.id)[0].quantity <
            product.quantity,
      );

      if (quantityAvailable.length) {
         throw new AppError(
            `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}.`,
         );
      }

      const serializedProducts = products.map(product => ({
         product_id: product.id,
         quantity: product.quantity,
         price: existsproducts.filter(p => p.id === product.id)[0].price,
      }));

      const order = await ordersRepository.createOrder({
         customer: customerExists,
         products: serializedProducts,
      });

      const { order_products } = order;
      const updatedProductQuantity = order_products.map(product => ({
         id: product.product_id,
         quantity:
            existsproducts.filter(p => p.id === product.product_id)[0]
               .quantity - product.quantity,
      }));

      await productRepository.save(updatedProductQuantity);

      return order;
   }
}

export default CreateOrderService;
