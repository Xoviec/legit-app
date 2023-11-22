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

//znajdz uzytkownika
app.get('/search-users', async (req, res) => {
    // Pobierz litery z parametru zapytania
    const searchLetters = req.query.letters;
  
    // Jeśli parametr nie został przekazany, zwróć błąd
    if (!searchLetters) {
      return res.status(400).json({ error: 'Parametr "letters" jest wymagany.' });
    }
  
    try {
      // Wyszukaj użytkowników, których nick zawiera przekazane litery
      const { data, error } = await supabase
        .from('users')
        .select('id, nickname, avatar, items_list, is_verified, account_type')
        .ilike('nickname', `%${searchLetters}%`);
  
      if (error) {
        return res.status(500).send(error.message);
      }
  
      // Zwróć znalezione użytkowników
      res.json(data);
    } catch (error) {
      console.error('Błąd podczas wyszukiwania użytkowników:', error.message);
      res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania żądania.' });
    }
  });

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

        console.log('es')
        const userItemsList = userItemsData[0].items_list;

        // Użyj Promise.all do oczekiwania na zakończenie wszystkich asynchronicznych operacji
        await Promise.all(userItemsList.map(async (id, i) => {
            const { data, error } = await supabase
                .from('legited_items')
                .select('og_item_id, owners_history')
                .eq('id', id);
        
            let { data: ogItemData, error: ogItemError } = await supabase
                .from('items')
                .select()
                .eq('id', data[0].og_item_id);

                // console.log(userItemsList[i])
            // Dodaj nowy klucz 'registerID' z wartością z userItemsList[i]
            ogItemData[0].registerID = userItemsList[i];
            ogItemData[0].ownersHistory = data[0].owners_history
            // console.log(data[0].owners_history)


        
            itemsData.push(ogItemData[0]);
        }));

        // Zwróć itemsData jako tablicę obiektów JSON
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

app.post('/change-owner', async function (req, res){


    let date = new Date().toJSON();
    const currentOwner = req.body.currentOwner
    const newOwner = req.body.newOwner
    const registerID= req.body.registerID

    console.log('xd')
    console.log(currentOwner, newOwner, registerID)

    try{
        const { data: ownersHistory, error: fetchDataError } = await supabase
            .from('legited_items')
            .select('owners_history')
            .eq('id', registerID)

        console.log(ownersHistory[0].owners_history)

        const newHistoryObj = {
            ownerID: newOwner,
            registerDate: date
        }

        let newOwnersHistory = [...ownersHistory[0].owners_history, newHistoryObj]





        //usuwanie itemku z listy itemów uzytkownika
        const { data: prevUserData, error: fetchPrevUserDataError } = await supabase
            .from('users')
            .select('items_list')
            .eq('id', currentOwner)

        console.log(prevUserData[0].items_list)

        const newItemsList = prevUserData[0].items_list.filter((itemID)=>itemID!==registerID)

        const {error: deleteUserItemError} = await supabase
            .from('users')
            .update({items_list: newItemsList})
            .eq('id', currentOwner)


        //dodanie itemku nowemu ownerowi

        const { data: newUserData, error: fetchnewUserDataError } = await supabase
            .from('users')
            .select('items_list')
            .eq('id', newOwner)


        console.log('new user data')
        console.log(newUserData[0].items_list)
        

        //zabezpieczenie zeby nie dodac jednego zarejestrowanego itemu kilka razy
        if((!newItemsList.includes(registerID))&&!(newUserData[0].items_list.includes(registerID))){
            const newItemOwnerList = [...newUserData[0].items_list, registerID]
            const {error: addUserItemError} = await supabase
                .from('users')
                .update({items_list: newItemOwnerList})
                .eq('id', newOwner)
            
            //dodanie nowego user history do itemka
            const {error} = await supabase
                .from('legited_items')
                .update({owners_history: newOwnersHistory})
                .eq('id', registerID)
        }



        // console.log('xd')
        // console.log(newItemOwnerList)



        

            
    }catch(err){
        console.log(err)
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
                    {
                        ownerID: req.body.itemData.ownerHistory,
                        registerDate: date
                    }
                ]
            })
        if(error){
            console.log(error)
            
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