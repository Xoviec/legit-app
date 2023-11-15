const { createClient } = require('@supabase/supabase-js');
const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(cors())

const PORT = 8000


const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL, 
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


app.get('/nicknames', async function (req, res) {
    const { data, error } = await supabase.from('users').select('id, nickname')
    res.send(data)
})

app.listen(PORT, ()=> console.log('working'))