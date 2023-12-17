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
    const { data, error } = await supabase
    .from('users')
    .select('id, nickname, avatar, is_verified, account_type, description')
    res.send(data)
})

//znajdź przedmiot
app.get('/search-items', async (req, res) => {
    // Pobierz litery z parametru zapytania
    const searchLetters = req.query.letters;
  
    // Jeśli parametr nie został przekazany, zwróć błąd
    if (!searchLetters) {
      return res.status(400).json({ error: 'Parametr "letters" jest wymagany.' });
    }
  
    try {
      // Wyszukaj użytkowników, których nick zawiera przekazane litery
      const { data, error } = await supabase
        .from('items')
        .select()
        .ilike('name', `%${searchLetters}%`);
  
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


//znajdz uzytkownika
app.get('/search-users', async (req, res) => {
    const searchLetters = req.query.letters;
  
    if (!searchLetters) {
      return res.status(400).json({ error: 'Parametr "letters" jest wymagany.' });
    }
  
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nickname, avatar, is_verified, account_type')
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

    const { data, error } = await supabase
    .from('users')
    .select('id, nickname, avatar, is_verified, account_type, description')
    .ilike('nickname', nickname);

    if (error) {
        return res.status(500).send(error.message);
    }

    res.send(data);
});

// konkretny uzytkownik z wrazliwymi danymi
app.get('/secret/:id', async function (req, res){
    const { id } = req.params;
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', id);
        
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
            .select('id')
            .ilike('nickname', nickname);

        if (userItemsError) {
            throw userItemsError;
        }

        const itemsOwner = userItemsData[0].id


            const {data, error} = await supabase
                .from('legited_items')
                .select()
                .eq('current_owner', itemsOwner)

            console.log(error)
        

        itemsData = data.map((item)=>({
            ...item,
            owner_nickname: nickname
        }))

    
    const fetchItemData = async (item) => {
        const { data: ogItemData, error: ogItemError } = await supabase
        .from('items')
        .select(`name, brand, sku, image`)
        .eq('id', item.og_item_id);
    
        return ogItemData[0]; 
    };
    
    const fetchAllItemData = async (itemsData) => {
        const itemDataArray = await Promise.all(itemsData.map(fetchItemData));
        return itemDataArray;
    };
    
    const updatedItemsData = await fetchAllItemData(itemsData);
    
    itemsData = itemsData.map((item, index) => ({
        ...item,
        name: updatedItemsData[index].name,
        brand: updatedItemsData[index].brand,
        sku: updatedItemsData[index].sku,
        image: updatedItemsData[index].image,

    }));
        res.status(200).json(itemsData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Wystąpił błąd podczas pobierania danych użytkownika.');
    }
});

// dodanie itemów
app.post('/items', async function (req, res){

    if(req.body.accountType==='admin'){
        const { error } = await supabase
        .from('items')
        .insert({ name: req.body.itemData.name, sku: req.body.itemData.sku, brand: req.body.itemData.brand,   })
    }
})

// zmiana własciciela
app.post('/change-owner', async function (req, res){


    let date = new Date().toJSON();
    const currentOwner = req.body.currentOwner
    const newOwner = req.body.newOwner
    const registerID= req.body.registerID
    const verifyID= req.body.verifyID


    if(verifyID===currentOwner){


        try{
            const { data: ownersHistory, error: fetchDataError } = await supabase
                .from('legited_items')
                .select('owners_history, current_owner')
                .eq('id', registerID)   

 
            const newHistoryObj = {
                ownerID: newOwner,
                registerDate: date
            }
    
            let newOwnersHistory = [...ownersHistory[0].owners_history, newHistoryObj]
   

            if(ownersHistory[0].current_owner===currentOwner){
                const {error: updateOwnersHistoryError} = await supabase
                    .from('legited_items')
                    .update({owners_history: newOwnersHistory})
                    .eq('id', registerID)
            }
            const {error: updateCurrentOwnerError} = await supabase
            .from('legited_items')
            .update({current_owner: newOwner})
            .eq('id', registerID)
                
        }catch(err){
            console.log(err)
        }
  
    }else{
        return res.status(500).json({ error: 'Nie możesz przekazać nie swojego przedmiotu' });
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
                ],
                current_owner: req.body.itemData.ownerHistory
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

            const newUserItems = existingData[0]?.items_list || [];
            newUserItems.push(newUUID);

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

            return res.status(200).json({ message: 'Pomyślnie przypisano przedmiot' });
    }
})

// wyswietla wszystkie zarejestrowane itemy
app.get('/legited-items', async function (req, res){
    const { data, error } = await supabase.from('legited_items').select()
    res.send(data)
})


app.get('/most-items', async function (req, res){
    const {data, error} = await supabase
        .from('legited_items')
        .select('current_owner')


        const result = data.reduce((acc, item) => {
            const key = item.current_owner
            if (!acc.hasOwnProperty(key)) {
              acc[key] = 0
            }
            acc[key] += 1
            return acc
          }, {})
          
          // not sure why you want the result to be multiple objects. But here you go:
          
          const output = await Promise.all(
            Object.entries(result).map(async ([key, value]) => {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('nickname, avatar')
                .eq('id', key)
          
 
              return {
                userID: key,
                itemAmount: value,
                nickname: userData[0].nickname,
                avatar: userData[0].avatar
              };
            })
          );

          const sortedOutput = output.sort((a,b)=>
            b.itemAmount - a.itemAmount
          )
          
        //   const sortedOutput = output.sort((a, b) => b.itemAmount - a.itemAmount);


        //   const newOutput = output.sort()

        res.send(sortedOutput)

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

    return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji nickname.' });
    }
})

//szukanie komentarzy na profilu użytkownika
app.get('/get-comments/:id', async function (req, res){
    const { id } = req.params;

    console.log( id)
    const { data: commentData, error: commentError } = await supabase
        .from('comments')
        .select()
        .eq('comment_on', id);
    if(commentError){
        console.log(commentError)
    }

    let output
    console.log('comment data:', commentData)


    if(commentData){

        output = await Promise.all(commentData.map( async (comment, i) =>{

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('nickname, avatar')
                .eq('id', comment.comment_by)


            
                console.log('kontrolna kurwa')
                console.log('cipeunia', userData[0].nickname)


                return{
                    ...comment,
                    comment_by_nickname: userData[0].nickname,
                    avatar: userData[0].avatar
                }
                
        }))
    }
    console.log('console log outputu', output)


    res.send(output)

})

//dodawanie komentarza
app.post('/add-comment', async function (req, res){
    console.log(req.body)
    const { error } = await supabase
    .from('comments')
    .insert({ 
        comment_by: req.body.commentBy,
        comment_on: req.body.commentOn, 
        content: req.body.content
        
    })
})

app.post('/delete-comment', async function (req, res){
    console.log(req.body.id)
    const commentID = req.body.id
    const userNick = req.body.userNick


    const { data, error: getComments } = await supabase
        .from('comments')
        .select()
        .eq('id', commentID);

    console.log('wisla to sstara kurwa')
    console.log(data)
    console.log(data[0]?.comment_by)
    console.log(userNick)

    if(data[0]?.comment_by === userNick){
        const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentID)
    }
    else{
        return res.status(500).json({ error: 'Nie mozesz usunac czyjegos komentarza' });    }
    

})



app.listen(PORT, ()=> console.log('working on port', PORT))