import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
   id: string;
   name: string;
   email: string;
   avatar: string;
}

class UpdateUserService {
   public async execute({ id, name, email, avatar }: IRequest): Promise<User> {
      const usersRepository = getCustomRepository(UsersRepository);

      const user = await usersRepository.findOne(id);

      if (!user) {
         throw new AppError('User not found.');
      }

      const userExists = await usersRepository.findByEmail(email);

      if (userExists && userExists.id !== id) {
         throw new AppError(
            'There is already one user with this email address',
         );
      }

      user.name = name;
      user.email = email;
      user.avatar = avatar;

      await usersRepository.save(user);

      return user;
   }
}

export default UpdateUserService;
