import 'dotenv/config';
import * as cron from 'node-cron';
import main from './bot';
import redirector from './redirector';

const crontab = process.env.CRONTAB || '0 * * * *';

cron.schedule(crontab, async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  }
});

redirector.listen(process.env.PORT || 8080, () =>
  console.log('!HN is running...'),
);
