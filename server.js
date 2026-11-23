
import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ClearLedger API'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ClearLedger server running on port ${PORT}`);
});
