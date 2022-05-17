import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
   id: string;
}

class DeleteUserService {
   public async execute({ id }: IRequest): Promise<void> {
      const userRepository = getCustomRepository(UsersRepository);

      const product = await userRepository.findOne(id);

      if (!product) {
         throw new AppError('Product not found.');
      }

      await userRepository.remove(product);
   }
}

export default DeleteUserService;
