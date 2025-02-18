const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};

const connection = mysql.createConnection(config);
connection.connect(err => {
  if (err) {
    console.error('Erro de conexão com MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
  connection.query(`CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))`);
});

app.get('/', (req, res) => {
  connection.query("INSERT INTO people(name) values('Full Cycle Name')", () => {
    connection.query('SELECT name FROM people', (err, results) => {
      if (err) {
        console.error('Erro de conexão com MySQL:', err);
        res.status(500).send('Erro de Consulta no MySQL');
        return;
      }
      res.send(`<h1>Full Cycle Rocks!</h1><ul>${results.map(p => `<li>${p.name}</li>`).join('')}</ul>`);
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
