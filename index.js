const mysql = require('mysql');
const path = require('path');
const express = require('express');
const app = express();
const port = 8963;

var con = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rto_exam_quiz'
})

con.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
app.use(express.json());

app.get('/get-questions', (req, res) => {
    const query = `SELECT question,option1,option2,option3,option4,correctanswer FROM quiz_questions ORDER BY RAND() LIMIT 15`;

    con.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Error retrieving question' });
        } 
        else if (results.length === 0) {
            res.status(404).json({ error: 'Question not found' });
        } 
        else {
            const questions = results.map((row) => {
                return {
                    question: row.question,
                    options: [row.option1, row.option2, row.option3, row.option4],
                    correctanswer: row.correctanswer,
                };
            });
            res.json(questions);
        }
    });
});

let name;
app.post('/save-username', (req, res) =>{
 name = req.body.name
})

app.post('/save-quiz-result', (req, res) => {
    const { count, result } = req.body; // Assuming you're sending these as JSON in the request body

    const insertQuery = 'INSERT INTO quiz_result (name, score, result) VALUES (?, ?, ?)';

    con.query(insertQuery, [name, count, result], (err, results) => {
        if (err) {
            console.error('Error saving quiz result:', err);
            res.status(500).json({ error: 'Error saving quiz result' });
        } else {
            res.json({ message: 'Quiz result saved successfully' });
        }
    });
});

app.get('/startover', (req, res) => {
    res.redirect('/index.html');
    
  });

  app.get('/admin_89', (req, res) => {
    res.redirect('/admin.html');
});

app.get('/get-all-data', (req, res) => {
    const query = 'SELECT * FROM quiz_result';

    con.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Error retrieving data' });
        } else {
            res.json(results);
        }
    });
});

app.post('/update-data', (req, res) => {
    const { id, name, score, result } = req.body;

    const updateQuery = 'UPDATE quiz_result SET name = ?, score = ?, result = ? WHERE id = ?';

    con.query(updateQuery, [name, score, result, id], (err, results) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).json({ error: 'Error updating data' });
        } else {
            res.json({ message: 'Data updated successfully' });
        }
    });
});

app.post('/delete-data', (req, res) => {
    const { id } = req.body;

    const deleteQuery = 'DELETE FROM quiz_result WHERE id = ?';

    con.query(deleteQuery, [id], (err, results) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ error: 'Error deleting data' });
        } else {
            res.json({ message: 'Data deleted successfully' });
        }
    });
});

  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

