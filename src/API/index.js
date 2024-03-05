const SneaksAPI = require('sneaks-api');
const { jwtDecode } = require ('jwt-decode');
const jwt = require('jsonwebtoken');

const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const express = require('express')
const cors = require('cors')
const path = require('path')
const {Storage} = require('@google-cloud/storage')
const multer  = require('multer')
const sharp = require('sharp');

const { Readable } = require('stream');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const sneaks = new SneaksAPI();

const secretKey = 'MDJSmCwUgpKBo8vPyf50tR3hhDnFqwKb5blvaXgs5iiEcnd7tlJW1vXir7MFgEHCFUrALhxk66Hwz94AbPQL7A=='


require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json());


const PORT = 8000


const supabase = createClient(
    process.env.VITE_SUPABASE_URL, 
    process.env.VITE_SUPABASE_ANON_KEY
);


async function uploadFile(bucketName, fileBuffer, fileOutputName) {
    try {
        // Kompresja obrazu za pomocą sharp
        const compressedBuffer = await sharp(fileBuffer)
            .resize({ width: 200, height: 200})
            .jpeg ({ quality: 50 })
            .webp ({ quality: 50 })
            .png ({ compressionLevel: 9 }) // Dostosuj szerokość według potrzeb
            .toBuffer();

        const projectId = 'glassy-chalice-415420';
        const keyFilename = path.join(__dirname, 'glassy-chalice-415420-d31b54a58de0.json');
        const storage = new Storage({ projectId, keyFilename });
        const bucket = storage.bucket(bucketName);

        const file = bucket.file(fileOutputName);

        // Zapisz skompresowany plik
        await file.save(compressedBuffer);

        const [metadata] = await file.getMetadata();
        const fileUrl = await file.getSignedUrl({
            action: 'read',
            expires: '01-01-2100',
        });

        return fileUrl[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//wszyscy uzytkownicy

app.get('/nicknames', async function (req, res) {
    const { data, error } = await supabase
    .from('users')
    .select('id, nickname, avatar, is_verified, account_type, description')
    res.send(data)
})

//znajdź przedmiot
app.get('/search-items', async (req, res) => {
    const searchLetters = req.query.letters;
  
    if (!searchLetters) {
      return res.status(400).json({ error: 'P' });
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

app.get('/search-user', async (req,res)=>{
    const searchUser = req.query.nickname;

    if (!searchUser) {
        return res.status(400).json({ error: 'Parametr "nickname" jest wymagany.' });
      }
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, nickname, avatar, is_verified, account_type')
          .ilike('nickname', searchUser);
    
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



    const token = req.headers.jwt;

    if (!token) {
      return res.status(401).json({ error: 'Brak tokena JWT' });
    }


    try {
        const decoded = jwt.verify(token, secretKey)
        console.log('xd', secretKey)


        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('id', decoded.sub);
            
        if(error){
            res.sendStatus("error")
        }else{
            res.status(200).send(data);
        }



    //   res.json({ message: 'Dostęp do tajnych danych', userId: decoded.sub });
    } catch (error) {
      res.status(401).json({ error: 'Nieprawidłowy token JWT' });
    }
})

app.get('/test', function (req, res){
    return res.status(200).send('działa essa')
})
// wszystkie itemy
app.get('/items', async function (req, res) {
    const { data, error } = await supabase.from('items').select()
        if(error){
            res.sendStatus(500)
        }else{
            res.send(data)
        }
})

const isAdmin = async (token) =>{
    if(!token){
        return false
    }
    try{
        const decoded = jwt.verify(token, secretKey)

        const { data, error } = await supabase
            .from('users')
            .select('account_type')
            .eq('id', decoded.sub);


            console.log(data[0].account_type)

        if(data[0].account_type === 'admin'){

            console.log('to admin')
            return true
            // return res.status(200).send('Admin verified');
        }
        else if(error){
            return false
            // return res.sendStatus("error")

        }
        else{
            return false
            // return res.status(403).send('Forbidden');
        }
    }catch(err){
        return false
    }
}

app.get('/admin-access', async function (req, res){



    const token = req.headers.jwt;

    console.log(token)

    if (!token) {
      return res.status(401).json({ error: 'Brak tokena JWT' });
    }

    try {
        const decoded = jwt.verify(token, secretKey)

        const { data, error } = await supabase
            .from('users')
            .select('account_type')
            .eq('id', decoded.sub);


            console.log(data[0].account_type)

        if(data[0].account_type === 'admin'){
            return res.status(200).send(true);
        }
        // else if(data[0].account_type !== 'admin' ){
        //     return res.status(200).send('Admin verified');

        // }
        // else if(error){
        //     res.sendStatus("error")

        // }
        else{
            res.status(200).send(false);
        }
            
        if(error){
            res.sendStatus(401)
        }
    


    } catch (error) {
      res.status(401).json({ error: 'Nieprawidłowy token JWT' });
    }

    // try{
    //     const decoded = jwtDecode(req.headers.jwt);

    //     if(!decoded){
    //         return res.status(403).send('No access, no jwt');
    //     }
    
    //     const { data, error } = await supabase
    //         .from('users')
    //         .select('account_type')
    //         .eq('id', decoded.sub);

    //     if(data[0].account_type === 'admin'){
    //         res.status(200).send('Admin verified');
    //     }else{
    //         res.status(403).send('Forbidden');
    //     }


    // }catch(error){
    //     res.status(403).send('No access');
    // }
})

// sneaks.getProductPrices("CD4487-100", function(err, product){
//     console.log(product)
// })


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

        const itemsOwner = userItemsData[0]?.id


            const {data, error} = await supabase
                .from('legited_items')
                .select()
                .eq('current_owner', itemsOwner)

            console.log(error)
        

        itemsData = data?.map((item)=>({
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

// dodanie avataru

app.post('/set-avatar', upload.single('file'), async (req, res) => {

    console.log(req.body.userID)

    const userID = req.body.userID
    const userNickname = req.body.userNickname

    // console.log(req.body.userNickname)
    try {
        const uploadedFile = req.file.buffer;
        const fileUrl = await uploadFile('legited-avatars2', uploadedFile, `${userNickname}-avatar.webp`);
        console.log('Direct link to the uploaded file:', fileUrl);
        
        try{


            const {error: updateOwnersHistoryError} = await supabase
                .from('users')
                .update({avatar: fileUrl})
                .eq('id', userID)
            
            res.status(200).send('Pomyślnie zmieniono avatar');

        }catch(error){
            console.log(error)
        }

    } catch (error) {
        console.error('Wystąpił błąd:', error);
        res.status(500).send('Wystąpił błąd podczas przesyłania pliku.');
    }
    
});



app.post('/items', async function (req, res){

    const token = req.body.jwt

    try{
        const adminCheck = await isAdmin(token)

        if(adminCheck){
            const { error: addItemError } = await supabase
                .from('items')
                .insert({ name: req.body.itemData.name, sku: req.body.itemData.sku, brand: req.body.itemData.brand, image: req.body.itemData.image})

            if(addItemError){
                res.sendStatus(403)
            }else{
                // res.status(200).send('some text');
                res.sendStatus(201)
            }
            
        }else{
            res.sendStatus(401)
        }
    }
    catch(err){
        console.log('xd', err)
        res.sendStatus(401)
    }
})

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

    let date = new Date().toJSON();
    const newUUID = uuidv4()

    const token = req.body.jwt

    if(!req.body?.itemData?.ogItemId || !req.body?.itemData?.ownerHistory){
        return res.status(400).send("Pola nie mogą być puste")
    }

    try{
 

        const adminCheck = await isAdmin(token)


        if(adminCheck){
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
                res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji nickname.' });
            }else{
                res.status(201).json({ message: 'Pomyślnie przypisano przedmiot' });
            }

        }else{
            res.sendStatus(403)
        }
        }catch(err){
            console.log(err)
            res.sendStatus(403)
        }

})

app.get('/legited-items', async function (req, res){

    const page = parseInt(req.query.page);

    const resultsPerPage = 20

    
    try{
        const { data, count, error } = await supabase.from('legited_items')
            .select('*', {count: 'exact'})
            .order('legited_at', { ascending: false })
            .range((page-1)*resultsPerPage, page*resultsPerPage-1)


            const pageLimit = Math.ceil(count/resultsPerPage)



            if(!data){
                res.sendStatus(400)
                
            }else{



            data?.map(async (data) => {
                if (data.owners_history.length > 1) {
                    await Promise.all(data.owners_history.reverse().map(async (user) => { //data.owners_history.slice(0, -1).map było jeśli chcemy wyjebać tego najnowszego, ale lepiej zostawić bo widać date od kiedy jest ownerem
                        const { data: userData, error: userError } = await supabase
                            .from('users')
                            .select('nickname')
                            .eq('id', user.ownerID)

                        user.ownerID=userData[0]?.nickname
                    }));
                }
            });
            
            


            const fullData = await Promise.all(data?.map( async(item, i) =>{
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('nickname')
                    .eq('id', item.current_owner)

                const { data: itemData, error: itemError } = await supabase
                    .from('items')
                    .select('name')
                    .eq('id', item.og_item_id)

                return{
                    ...item,
                    current_owner_nickname: userData[0].nickname,
                    item_name: itemData[0].name
                }

            }))




            const response = {
                data: fullData,
                dataLength: count,
                pageLimit: pageLimit
            }


        res.status(200).send(response)
    }
    
    }catch(err){
        console.log(err)
    }

})

app.get('/legited-item/:itemID', async function (req,res){

    const { itemID } = req.params;

    try{

        const {data: legitedItemData, legitedItemError} = await supabase
            .from('legited_items')
            .select()
            .eq('id', itemID)

        const {data: ogItemData, ogItemError} = await supabase
            .from('items')
            .select('name, sku, brand, image')
            .eq('id', legitedItemData[0].og_item_id)

        const {data: userData, userError} = await supabase
            .from('users')
            .select('nickname, avatar')
            .eq('id', legitedItemData[0].current_owner)

        const dataRes = {...ogItemData[0], ...legitedItemData[0], ...userData[0]}

        return res.status(200).send(dataRes)

    }catch(err){
        console.log(err)
        return res.sendStatus(400)
    }

})

app.get('/most-items', async function (req, res){

    try{


    const {data, error} = await supabase
        .from('legited_items')
        .select('current_owner')

        if(error){
            throw error
        }

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

                if(userData[0]!== null){
                // console.log('essa', userData[0])

                }

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


        res.send(sortedOutput)

    }catch(error){

        console.error('Error fetching legited_items data:', error);
        res.status(500).send('Internal Server Error'); // or handle the error as needed

    }



        })

app.post('/update-nickname', async function (req, res){

    const { error } = await supabase
        .from('users')
        .update({ nickname: req.body.newNickname })
        .eq('id', req.body.id)
    if(!error){
        return res.status(200).json({message: 'ok'})
    }
    if(error){
        return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji nickname.' });
    }
})

app.post('/update-description', async function (req, res){
  
    const { error } = await supabase
        .from('users')
        .update({ description: req.body.newDescription })
        .eq('id', req.body.id)
    if(!error){
        return res.status(200).json({message: 'ok'})
    }
    if(error){
        console.log(error)
        return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji opisu.' });
    }
})



app.get('/get-comments/:id', async function (req, res){
    
    const { id } = req.params;

    try{
        const { data: commentData, error: commentError } = await supabase
            .from('comments')
            .select()
            .eq('comment_on', id);
        if(commentError){
            console.log(commentError)
        }

        let output

        if(commentData){

            output = await Promise.all(commentData.map( async (comment, i) =>{

                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('nickname, avatar')
                    .eq('id', comment.comment_by)

                    return{
                        ...comment,
                        comment_by_nickname: userData[0].nickname,
                        avatar: userData[0].avatar
                    }
            }))
        }
        res.send(output)
        }
        catch(error){
            res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania żądania.' });
        }
})

app.post('/add-comment', async function (req, res){

    if(req.body.comment_by && req.body.comment_on && req.body.content && req.body.id){


    try{
        const { error } = await supabase
        .from('comments')
        .insert({ 
            id: req.body.id,
            comment_by: req.body.comment_by,
            comment_on: req.body.comment_on, 
            content: req.body.content
            
        })
        if(error){
            res.sendStatus(400)
            console.log(error)
        }
        else{
            res.sendStatus(201)
        }

    }catch(err){
        console.log(err)
    }
    }
    else{
        res.sendStatus(400)
    }

})

app.delete('/delete-comment', async function (req, res){
    const commentID = req.body.id
    const comment_by_id = req.body.comment_by_id

    console.log('test', req.body)
    console.log('test', comment_by_id)

    const { data, error: getComments } = await supabase
        .from('comments')
        .select()
        .eq('id', commentID);

    try{
        if(data[0]?.comment_by === comment_by_id){
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentID)
                .eq('comment_by',comment_by_id)
            if(error){
                res.sendStatus(400)
                console.log('jakiś błąd: ',error)
            }
            else{
                res.sendStatus(200)
            }

        }
        else{
            return res.status(401).json({ error: 'Nie mozesz usunac czyjegos komentarza' }); 
        }
    }catch(err){
        console.log(err)
        res.sendStatus(400)
    }

})



app.listen(PORT, ()=> console.log('working on port', PORT))