import AppError from '@shared/errors/AppError';
import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

export default class UserAvatarController {
   public async update(
      request: Request,
      response: Response,
   ): Promise<Response> {
      const updateAvatar = new UpdateUserAvatarService();

      const requestFileName = request.file?.filename;

      if (!requestFileName) {
         throw new AppError('Avatar file not sended.');
      }

      const user = await updateAvatar.execute({
         user_id: request.user.id,
         avatarFileName: requestFileName,
      });

      return response.json(user);
   }
}
