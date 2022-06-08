interface IMailConfig {
   driver: 'ethereal' | 'ses';
   defaults: {
      from: {
         email: string;
         name: string;
      };
   };
}

export default {
   driver: process.env.MAIL_DRIVER || 'ethereal',
   defaults: {
      from: {
         email: 'contact@devdroid.com.br',
         name: 'Sales API Team',
      },
   },
} as IMailConfig;
