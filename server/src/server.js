// bibliotecas ------------------------------------------------------------------------------------------------------------------------
const app = require('./app');
const routes = require('./routes')
const express = require('express')


// porta do servidor ----------------------------------------------------------------------------------------------------------------
const port = process.env.port || 8000
app.listen(port, () => console.log(`Server running or port ${port}`));


