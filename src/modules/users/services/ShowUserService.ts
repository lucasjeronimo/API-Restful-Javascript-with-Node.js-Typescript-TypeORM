import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
   id: string;
   email: string;
}

class ShowUserService {
   public async execute({ id, email }: IRequest): Promise<User> {
      const usersRepository = getCustomRepository(UsersRepository);

      let user = await usersRepository.findOne(id);

      if (!user && email != '') user = await usersRepository.findByEmail(email);

      if (!user) {
         throw new AppError('User not found.');
      }
      return user;
   }
}

export default ShowUserService;
