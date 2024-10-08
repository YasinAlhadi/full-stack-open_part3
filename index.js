const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
morgan.token('body-logger', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body-logger'
  )
);

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const date = new Date();
  res
    .send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    )
    .end();
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  const idNum = Math.floor(Math.random() * 3000);

  if (!body.name) return res.status(400).json({ error: 'Name is required' });
  if (persons.find((person) => person.name === body.name))
    return res.json({ error: 'name must be unique' });

  const person = {
    id: idNum,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app listen on port ${PORT}`);
});
