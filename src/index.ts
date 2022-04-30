import cron from 'node-cron';
import main from './bot';

cron.schedule('0 * * * *', () => {
  main();
});
