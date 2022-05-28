const express = require('express');
const crypto = require('crypto')

const app = express();

app.use(express.json());

const customers = [];

app.post('/accounts', (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

  if (customerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists!' })
  }

  const id = crypto.randomUUID();

  customers.push({
    cpf,
    name,
    id,
    statement: [],
  });

  response.status(201).send();
});

app.get('/statements/', (request, response) => {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(404).send({ error: 'Customer not found!' });
  }
  return response.json(customer.statement);
});

app.listen(3333);
