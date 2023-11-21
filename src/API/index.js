const { v4: uuidv4 } = require('uuid');
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

// lista itemów danego uzytkownika
// app.get('/:nickname/items', async function(req, res){
//     const {nickname} = req.params;
//     const { data, error } = await supabase.from('users').select('items_list').ilike('nickname', nickname);
//     if (error) {
//         return res.status(500).send(error.message);
//     }
//     // res.send(data)
//     const itemsList = data && Array.isArray(data[0]?.items_list) ? data[0].items_list : [];

//     // Wyodrębnij tylko wartości UUID
//     const uuidArray = itemsList.map(item => item);

//     res.send(uuidArray);
// })



// przedmioty uzytkownika
app.get('/user-items/:nickname', async function(req, res) {
    const { nickname } = req.params;
    let itemsData = [];

    try {
        const { data: userItemsData, error: userItemsError } = await supabase
            .from('users')
            .select('items_list')
            .eq('nickname', nickname);

        if (userItemsError) {
            throw userItemsError;
        }

        const userItemsList = userItemsData[0].items_list;


        // Użyj Promise.all do oczekiwania na zakończenie wszystkich asynchronicznych operacji
        await Promise.all(userItemsList.map(async (id) => {

            const { data, error } = await supabase
                .from('legited_items')
                .select('og_item_id')
                .eq('id', id);


            const { data: ogItemData, error: ogItemError } = await supabase
                .from('items')
                .select()
                .eq('id', data[0].og_item_id);

            itemsData = [...itemsData, ...ogItemData];
        }));


        res.status(200).json(itemsData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Wystąpił błąd podczas pobierania danych użytkownika.');
    }
});






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

// zarejestrowanie unikalnego itemu i przypisanie go uzytkownikowi
app.post('/register-item', async function(req, res){
    console.log(req.body.accountType)
    console.log(req.body.itemData.ogItemId)
    console.log(req.body.itemData.ownerHistory)
    let date = new Date().toJSON();
    const newUUID = uuidv4()

    if(req.body.accountType==='admin'){
        const { error } = await supabase
            .from('legited_items')
            .insert({ 
                id: newUUID,
                og_item_id: req.body.itemData.ogItemId, 
                owners_history: [
                    { [req.body.itemData.ownerHistory]: date },
                ]
            })
        if(error){
            console.log(error)
            // res.send(error)
        return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji nickname.' });
        }

        const { data: existingData, error: fetchDataError } = await supabase
                .from('users')
                .select('items_list')
                .eq('id', req.body.itemData.ownerHistory);

            if (fetchDataError) {
                console.error(fetchDataError);
                return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych.' });
            }

            // Utwórz nową listę właścicieli
            const newUserItems = existingData[0]?.items_list || [];
            newUserItems.push(newUUID);

            // Zaktualizuj dane w bazie danych
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    items_list: newUserItems,
                })
                .eq('id', req.body.itemData.ownerHistory);

            if (updateError) {
                console.error(updateError);
                return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji danych.' });
            }

            // Dodaj odpowiednią odpowiedź w przypadku powodzenia
            return res.status(200).json({ message: 'Pomyślnie przypisano przedmiot' });
    }
})

// przypisanie uzytkownikowi itema chyba nieuzyeczne juz
// app.post('/assign-item', async function(req, res){
//     console.log(req.body.itemData)
//     console.log('xdd')
//     const { data: existingData, error: fetchDataError } = await supabase
//             .from('users')
//             .select('items_list')
//             .eq('id', req.body.itemData.ownerHistory);

//         if (fetchDataError) {
//             console.error(fetchDataError);
//             return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych.' });
//         }

//         // Utwórz nową listę właścicieli
//         const newOwnersHistory = existingData[0]?.items_list || [];
//         newOwnersHistory.push(req.body.itemData.ogItemId );

//         // Zaktualizuj dane w bazie danych
//         const { error: updateError } = await supabase
//             .from('users')
//             .update({
//                 items_list: newOwnersHistory,
//             })
//             .eq('id', req.body.itemData.ownerHistory);

//         if (updateError) {
//             console.error(updateError);
//             return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji danych.' });
//         }

//         // Dodaj odpowiednią odpowiedź w przypadku powodzenia
//         return res.status(200).json({ message: 'Pomyślnie przypisano przedmiot' });
// })

// wyswietla wszystkie zarejestrowane itemy
app.get('/legited-items', async function (req, res){
    const { data, error } = await supabase.from('legited_items').select()
    res.send(data)
})


// update nicku
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