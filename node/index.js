const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const config = {
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'nodedb'
};

function connectWithRetry() {
    const connection = mysql.createConnection(config);

    connection.connect(err => {
        if (err) {
            console.error('Erro ao conectar ao MySQL:', err);
            console.log('Tentando novamente em 5 segundos...');
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log('Conectado ao MySQL.');

            // Criar a tabela 'people' se ela não existir
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS people (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL
                )
            `;

            connection.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Erro ao criar a tabela:', err);
                    return;
                }
                console.log('Tabela people verificada/criada.');
            });
        }
    });

    return connection;
}

const connection = connectWithRetry();

app.get('/', (req, res) => {
    const insertQuery = "INSERT INTO people(name) values('Full Cycle Name')";

    connection.query(insertQuery, (err) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).send('Erro ao inserir dados no MySQL');
            return;
        }

        connection.query('SELECT name FROM people', (err, results) => {
            if (err) {
                console.error('Erro ao consultar dados:', err);
                res.status(500).send('Erro ao consultar dados no MySQL');
                return;
            }

            res.send(`<h1>Full Cycle Rocks!</h1><ul>${results.map(p => `<li>${p.name}</li>`).join('')}</ul>`);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
