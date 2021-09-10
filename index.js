const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const { PORT } = process.env || 3000;

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(PORT, () => { console.log(`Aplicação ouvindo na porta ${PORT}`); });
