import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import redisCache from '@shared/cache/RedisCache';

class ListProductService {
   public async execute(): Promise<Product[]> {
      const productsRepository = getCustomRepository(ProductRepository);

      //const redisCache = new RedisCache();

      let products = await redisCache.recover<Product[]>(
         'sales-api-PRODUCT_LIST',
      );

      if (!products) {
         products = await productsRepository.find();

         await redisCache.save('sales-api-PRODUCT_LIST', products);
      }

      return products;
   }
}

export default ListProductService;
