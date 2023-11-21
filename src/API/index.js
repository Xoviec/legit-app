const { createClient } = require('@supabase/supabase-js');
const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json());


const PORT = 8000


const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL, 
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

//wszyscy uzytkownicy

app.get('/nicknames', async function (req, res) {
    const { data, error } = await supabase.from('users').select('id, nickname, avatar, items_list, is_verified, account_type')
    res.send(data)
})

//konkretny uzytkownik bez wrazliwych danych

app.get('/nicknames/:nickname', async function (req, res) {
    const { nickname } = req.params;
        // const { data, error } = await supabase.from('users').select('id, nickname, avatar, items_list, is_verified, account_type').where

    const { data, error } = await supabase.from('users').select('id, nickname, avatar, items_list, is_verified, account_type').ilike('nickname', nickname);

    if (error) {
        return res.status(500).send(error.message);
    }

    res.send(data);
});

// konkretny uzytkownik z wrazliwymi danymi
app.get('/secret/:id', async function (req, res){
    const { id } = req.params;
    const { data, error } = await supabase.from('users').select().eq('id', id);
    if (error) {
        return res.status(500).send(error.message);
    }

    res.send(data);
})


// wszystkie itemy
app.get('/items', async function (req, res) {
    const { data, error } = await supabase.from('items').select()
    res.send(data)
})

// dodanie itemów
app.post('/items', async function (req, res){
    // console.log(req.body)
    // console.log(req.body.accountType)
    if(req.body.accountType==='admin'){
        const { error } = await supabase
        .from('items')
        .insert({ name: req.body.itemData.name, sku: req.body.itemData.sku, brand: req.body.itemData.brand,   })
    // return res.json(req.body)
    }
})

app.post('/update-nickname', async function (req, res){
    console.log(req.body.id)
    console.log(req.body.newNickname)
    const { error } = await supabase
    .from('users')
    .update({ nickname: req.body.newNickname })
    .eq('id', req.body.id)
    if(error){
        // console.log(error)
        // res.send(error)
    return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji nickname.' });


    }
})

app.listen(PORT, ()=> console.log('working'))