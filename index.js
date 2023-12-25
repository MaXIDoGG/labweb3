const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'ваш_секретный_ключ';

const client = new Client("postgresql://maks.nasonov.03:4bKdyM3zXASe@ep-sweet-brook-09241647.eu-central-1.aws.neon.tech/interfaces?sslmode=require");


client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public_html"));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get("/", async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public_html/index.html'));

    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }

});

// Роут для получения всех комментариев
app.get('/comments', (req, res) => {
    const query = 'SELECT * FROM comments';

    client.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка при загрузке комментариев' });
        } else {
            const comments = result.rows;
            res.status(200).json(comments);
        }
    });
});

// Роут для получения конкретного комментария
app.get('/comments/:id', (req, res) => {
    const commentId = req.params.id;
    const query = 'SELECT * FROM comments WHERE id = $1';

    client.query(query, [commentId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка при загрузке комментария' });
        } else {
            const comment = result.rows[0];
            res.status(200).json(comment);
        }
    });
});

// Роут для сохранения комментария в базе данных
app.post('/comments', (req, res) => {
    const { name, comment } = req.body;
    const query = 'INSERT INTO comments (name, comment) VALUES ($1, $2) RETURNING *';

    client.query(query, [name, comment], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка при сохранении комментария' });
        } else {
            const savedComment = result.rows[0];
            res.status(201).json(savedComment);
        }
    });
});

// Роут для редактирования комментария в базе данных
app.put('/comments/:id', (req, res) => {
    const commentId = req.params.id;
    const { name, comment } = req.body;
    const query = 'UPDATE comments SET name = $1, comment = $2 WHERE id = $3 RETURNING *';

    client.query(query, [name, comment, commentId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка при редактировании комментария' });
        } else {
            const editedComment = result.rows[0];
            res.status(200).json(editedComment);
        }
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});