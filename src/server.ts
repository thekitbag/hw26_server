import app from '@/app';
import { config } from '@/config/env';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`[Server] Running in ${config.nodeEnv} mode`);
  console.log(`[Server] Listening on port ${PORT}`);
  console.log(`[Server] Health check available at http://localhost:${PORT}/health`);
});
