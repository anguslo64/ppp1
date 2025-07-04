const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // 解析 JSON Body

app.post('/proxy/mops', async (req, res) => {
  try {
    const { companyId } = req.body;
    if (!companyId || typeof companyId !== 'string' || companyId.trim() === '') {
      return res.status(400).json({ error: 'companyId is required and must be a non-empty string' });
    }

    const response = await axios.post(
      'https://mops.twse.com.tw/mops/api/t146sb05',
      { companyId },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000, // 10秒超時
      }
    );

    // 檢查回應狀態碼
    if (response.status !== 200) {
      return res.status(response.status).json({ error: 'MOPS API returned non-200 status' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message || error.toString());
    // 針對 axios 的錯誤做細節回應
    if (error.response) {
      // MOPS API 回傳錯誤
      res.status(error.response.status).json({ error: error.response.data || 'MOPS API error' });
    } else if (error.request) {
      // 無收到回應
      res.status(504).json({ error: 'No response from MOPS API' });
    } else {
      // 其他錯誤
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
