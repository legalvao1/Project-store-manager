const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT;

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(port, () => { console.log(`Aplicação ouvindo na porta ${port}`); });
