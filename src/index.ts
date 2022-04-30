import cron from 'node-cron';
import main from './bot';
import redirector from './redirector';

cron.schedule('0 * * * *', () => {
  main();
});

redirector.listen(process.env.PORT || 8080, () =>
  console.log('!HN is running...'),
);
