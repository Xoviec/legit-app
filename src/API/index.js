import express from "express";
import connection from "./database.js";
import cors from "cors"
import {v4 as uuidv4} from "uuid"

const app = express();
app.use(cors())
app.use(express.json());

app.post('/register', function(req, res) {
    const { email, nickname, password } = req.body;
    const newUUID = uuidv4()

    if (!email || !nickname || !password) {
        return res.status(400).send({ error: "Email, nickname, and password are required." });
    }

    let sql = "INSERT INTO users (id, email, nickname, password) VALUES (?, ?, ?, ?)";

    connection.query(sql, [newUUID, email, nickname, password], function(err, result) {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: "Error inserting user into the database." });
        }
        res.status(201).send({ message: "User registered successfully!", data: newUUID });
    });
});

app.post('/login', function(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ error: 'Email i hasło są wymagane.' });
    }
    let sql = "SELECT id, email, password, nickname, account_type, description FROM users WHERE email = ? AND password = ?";

    connection.query(sql, [email, password], function(err, results) {
        if (err) {
            console.log(err)

            return res.status(500).send({ error: "Błąd serwera" });
        }

        if (results.length === 0) {
            return res.status(400).send({ error: "Nieprawidłowy email lub hasło." });
        }

        const user = results[0];

        res.status(200).send({ message: "Zalogowano pomyślnie!", userData: { userId: user.id, nickname: user.nickname, accountType: user.account_type, email: user.email, description: user.description} });
    });
});

app.post("/createComment", function(req, res){
    const {commentBy, commentOn, content} = req.body
    const newUUID = uuidv4()

    console.log("tutaj", commentBy, commentOn, content)

    if (!commentBy || !commentOn || content.length<=0) {
        return res.status(400).send({ error: "CommentOn, content and commentBy are required." });
    }

    let sql = "INSERT INTO comments (id, comment_on, comment_by, content) VALUES (?, ?, ?, ?)";

    connection.query(sql, [newUUID, commentOn, commentBy, content], function(err, result) {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: "Error inserting user into the database." });
        }
        
        res.status(201).send({ message: "Commented successfully!", data: newUUID });
    });
})


app.delete("/deleteComment/:id", function(req, res) {
    const { id } = req.params;

    let sql = `DELETE FROM comments WHERE id = ?`;

    connection.query(sql, [id], function(err, result) {
        if (err) {
            return res.status(500).send({ error: "Błąd serwera przy usuwaniu komentarza" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Komentarz o podanym id nie został znaleziony" });
        }

        res.status(200).send({ message: "Komentarz został pomyślnie usunięty" });
    });
});

app.post("/itemCreate", function(req, res){
    const {name, sku, brand, image} = req.body;
    const newUUID = uuidv4();


    let sql = "INSERT INTO items (id, name, sku, brand, image) VALUES (?, ?, ?, ?, ?)";

    connection.query(sql, [newUUID, name, sku, brand, image], function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: "Error inserting item into the database." });
        }

        res.status(201).send({ message: "Item added successfully!", data: newUUID });
    });

})

app.post("/itemRegister", function(req, res) {
    const { itemId, ownerId } = req.body;
    const newUUID = uuidv4();

    if (!itemId || !ownerId) {
        return res.status(400).send({ error: "itemId and ownerId are required." });
    }

    let sql = "INSERT INTO legited_items (id, item_id, current_owner) VALUES (?, ?, ?)";

    connection.query(sql, [newUUID, itemId, ownerId], function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: "Error inserting item into the database." });
        }

        res.status(201).send({ message: "Item assigned successfully!", data: newUUID });
    });
});

app.put("/sendItem/:id", function(req, res) {
    const { id } = req.params;
    const { newOwnerId } = req.body; 

    if (!newOwnerId) {
        return res.status(400).send({ error: "Brak newOwnerId w żądaniu" });
    }

    let sql = `UPDATE legited_items SET current_owner = ? WHERE id = ?`;

    connection.query(sql, [newOwnerId, id], function(err, result) {
        if (err) {
            return res.status(500).send({ error: "Błąd serwera przy aktualizacji właściciela" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Element o podanym id nie został znaleziony" });
        }

        res.status(200).send({ message: "Właściciel został pomyślnie zaktualizowany" });
    });
});


app.get("/getAllItems", function(req, res){
    let sql = `SELECT * FROM items`

    connection.query(sql,function(err, results){
        if(err){
            return res.status(500).send({ error: "Błąd serwera" });
        }
        res.status(200).send({ items: results });
    })
})

app.get("/comments/:nickname", function(req, res) {
    const { nickname } = req.params;

    let sql = `
        SELECT comments.id, comments.comment_on, comments.content, comments.created_at, comment_by, 
               users.id AS user_id, users.nickname, users.email
        FROM comments 
        INNER JOIN users ON comments.comment_by = users.id
        WHERE comments.comment_on = (
            SELECT id FROM users WHERE nickname = ?
        )
        ORDER BY comments.created_at DESC
    `;

    let countSql = `
        SELECT COUNT(*) AS total_count 
        FROM comments 
        WHERE comment_on = (SELECT id FROM users WHERE nickname = ?)
    `;

    let total_count
    connection.query(countSql, [nickname], function(err, countResults) {
        if (err) {
            return res.status(500).send({ error: "Błąd serwera przy liczeniu komentarzy" });
        }
         total_count = countResults[0]?.total_count || 0;
    });
    connection.query(sql, [nickname], function(err, results) {
        if (err) {
            return res.status(500).send({ error: "Błąd serwera przy pobieraniu komentarzy" });
        }
        res.status(200).send({ total_count, comments: results });
    });
});


app.get("/getUserData/:nickname", function(req, res){
    const{nickname} = req.params
    
    let sql = `SELECT 
        users.id,
        users.nickname,
        users.account_type,
        users.avatar,
        users.description,
        users.email
        FROM users
        WHERE users.nickname = ?`


        connection.query(sql, [nickname], function(err, results) {
            if (err) {
                console.log(err)
                return res.status(500).send({ error: "Błąd serwera" });
            }
            
            res.status(200).send({ userData: results[0] });
        });
})


app.get("/getItems/:items?", function(req, res) {
    const { items } = req.params;

    console.log(items)
    // Podstawowy SQL do wyszukiwania użytkowników
    let sql = `
        SELECT items.id, items.name, items.sku, items.brand, items.image
        FROM items
        WHERE 1 = 1
    `;

    // Jeśli istnieje nickname w parametrach, dodajemy filtr wyszukiwania z LIKE
    if (items) {
        sql += " AND items.name LIKE ?";
    }

    // Wykonanie zapytania do bazy danych
    connection.query(sql, [`%${items}%`].filter(Boolean), function(err, results) {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: "Błąd serwera" });
        }

        if (results.length === 0) {
            return res.status(404).send({ error: "Nie znaleziono użytkowników." });
        }

        res.status(200).send({ items: results });
    });
});

app.get("/searchUser/:nickname?", function(req, res) {
    const { nickname } = req.params;

    let sql = `
        SELECT users.id, users.nickname, users.email
        FROM users
        WHERE 1 = 1
    `;

    // Jeśli istnieje nickname w parametrach, dodajemy filtr wyszukiwania z LIKE
    if (nickname) {
        sql += " AND users.nickname LIKE ?";
    }

    // Wykonanie zapytania do bazy danych
    connection.query(sql, [`%${nickname}%`].filter(Boolean), function(err, results) {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: "Błąd serwera" });
        }

        if (results.length === 0) {
            return res.status(404).send({ error: "Nie znaleziono użytkowników." });
        }

        res.status(200).send({ users: results });
    });
});

app.get('/userItems2', (req, res) => {
    const { nickname, sortBy = 'name', order = 'ASC' } = req.query;

    // Wywołanie procedury `get_user_items` z trzema argumentami
    connection.query(
        'CALL get_user_items(?, ?, ?)',
        [nickname, sortBy, order],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Błąd serwera' });
            }
            
            const total_count = results[1][0].total_count; // Wynik z SELECT total_count
            const items = results[0]; // Wyniki z dynamicznego zapytania SQL
            
            res.status(200).json({ total_count, items });
        }
    );
});

app.get("/userItems/:nickname", function(req, res) {
    const { nickname }= req.params;
    const {order, sortBy} = req.query

    let sql = `
        SELECT 
            legited_items.id,
            items.id AS item_id,
            items.name,
            items.sku,
            items.brand,
            items.image,
            legited_items.legited_at
        FROM users
        INNER JOIN legited_items ON users.id = legited_items.current_owner
        INNER JOIN items ON items.id = legited_items.item_id
        WHERE users.nickname = ?
        ORDER BY items.${sortBy} ${order}
    `;

    let countSql = `
    SELECT COUNT(*) AS total_count 
    FROM legited_items 
    WHERE current_owner = (SELECT id FROM users WHERE nickname = ?)
`;

    let total_count;

    connection.query(countSql, [nickname], function(err, countResults) {
        if (err) {
            return res.status(500).send({ error: "Błąd serwera przy liczeniu przedmiotów" });
        }

         total_count = countResults[0]?.total_count || 0;

    });

    connection.query(sql, [nickname], function(err, results) {
        if (err) {
            return res.status(500).send({ error: "Błąd serwera" });
        }
        
        res.status(200).send({ total_count, items: results });
    });
});

app.get("/legitedItems", function(req, res) {
    connection.query('CALL get_legited_items()', function(err, results) {
        if (err) {
            return res.status(500).send({ error: "Błąd serwera" });
        }

        res.status(200).send({ items: results[0] }); // Procedura zwraca wyniki jako pierwszy element tablicy `results`
    });
});



app.put("/updateNickname/:id", function(req, res) {
    const { id } = req.params;
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).send({ error: "Brak nickname w żądaniu" });
    }

    // Najpierw sprawdź, czy nickname jest już zajęty przez innego użytkownika
    const checkNicknameSql = `SELECT id FROM users WHERE nickname = ? AND id != ?`;
    
    connection.query(checkNicknameSql, [nickname, id], function(err, results) {
        if (err) {
            return res.status(500).send({ error: "Błąd serwera podczas sprawdzania nickname" });
        }

        if (results.length > 0) {
            return res.status(400).send({ error: "Ten nickname jest już zajęty przez innego użytkownika" });
        }

        // Jeśli nickname jest dostępny, wykonaj aktualizację
        const updateNicknameSql = `UPDATE users SET nickname = ? WHERE id = ?`;

        connection.query(updateNicknameSql, [nickname, id], function(err, result) {
            if (err) {
                return res.status(500).send({ error: "Błąd serwera przy aktualizacji nickname" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send({ error: "Użytkownik o podanym id nie został znaleziony" });
            }

            res.status(200).send({ message: "Nickname został pomyślnie zaktualizowany", newNickname: nickname });
        });
    });
});


app.put("/updateDescription/:id", function(req, res) {
    const { id } = req.params;
    const { description } = req.body;

    const sql = `UPDATE users SET description = ? WHERE id = ?`;

    connection.query(sql, [description, id], function(err, result) {

        if (err) {
            return res.status(500).send({ error: "Błąd serwera przy aktualizacji description" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Użytkownik o podanym id nie został znaleziony" });
        }

        res.status(200).send({ message: "description został pomyślnie zaktualizowany", newDescription: description });
    });
});

app.delete("/deleteAccount/:userId", function(req, res) {
    const { userId } = req.params;

    console.log(userId)

    const sql = `DELETE FROM users WHERE id = ?`;

    connection.query(sql, [userId], function(err, results) {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: "Błąd serwera przy usuwaniu konta" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).send({ error: "Użytkownik nie znaleziony" });
        }

        res.status(200).send({ message: "Konto zostało usunięte pomyślnie" });
    });
});



app.listen(3030, function(){
    console.log("Listening on port 3030");
    connection.connect(function(err){
        if (err) {
            console.error("Error connecting to the database:", err);
            return;
        }
        console.log("Connected to the database");
    });
});
