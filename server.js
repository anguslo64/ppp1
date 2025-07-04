const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/proxy/mops', async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' });
    }

    const response = await axios.post(
      'https://mops.twse.com.tw/mops/api/t146sb05',
      qs.stringify({ companyId }), // 使用 x-www-form-urlencoded 格式
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://mops.twse.com.tw/mops/web/t146sb05',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('[Proxy Error]', error.message);
    res.status(500).json({
      error: 'Proxy failed',
      detail: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
