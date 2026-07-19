import dotenv from 'dotenv';

import { initializeDatabase } from './database/sqlite.js';
import { app } from './app.js';

dotenv.config();

const port = Number(process.env.PORT ?? 3000);

async function bootstrap(): Promise<void> {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Backend listo en http://localhost:${port}`);
  });
}

void bootstrap();
