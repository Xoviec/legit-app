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


app.get('/nicknames', async function (req, res) {
    const { data, error } = await supabase.from('users').select('id, nickname, avatar, items_list, is_verified, account_type')
    res.send(data)
})


app.get('/items', async function (req, res) {
    const { data, error } = await supabase.from('items').select()
    res.send(data)
})

app.post('/items', async function (req, res){
    console.log(req.body)
    console.log(req.body.accountType)
    if(req.body.accountType==='admin'){
        const { error } = await supabase
        .from('items')
        .insert({ name: req.body.itemData.name, sku: req.body.itemData.sku, brand: req.body.itemData.brand,   })
    // return res.json(req.body)
    }
 

})

const xd =async() =>{

    let { data: items, error } = await supabase
    .from('items')
    .select('*')
                console.log(items)
}

xd()

app.listen(PORT, ()=> console.log('working'))