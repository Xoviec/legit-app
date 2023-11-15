const { createClient } = require('@supabase/supabase-js');
const express = require('express')
const app = express()
const PORT = 8000
require('dotenv').config()


const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL, 
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


app.get('/xd', async function (req, res) {
    const { data, error } = await supabase.from('users').select('nickname')
    res.send(data)
//     console.log(data)
//     console.log(error)
//     console.log('[izda')
//   res.send('Hello World')
})

app.listen(PORT)

const xd = async() =>{
    const { data, error } = await supabase.from('users').select('nickname')
    console.log('xddsad',data)

}

xd()

console.log('xd')