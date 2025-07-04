const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // 解析 JSON

app.post('/proxy/mops', async (req, res) => {
  console.log('Received body:', req.body); // 確認收到的 body

  try {
    const { companyId } = req.body;
    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' });
    }

    const response = await axios.post(
      'https://mops.twse.com.tw/mops/api/t146sb05',
      { companyId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Proxy error' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
