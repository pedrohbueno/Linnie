
// chama bibliotecas ---------------------------------------------------------------------------------------------

const { Sequelize, DataTypes } = require('sequelize');
const app = require('../app')
const express = require('express')

//body parser ---------------------------------------------------------------------------------------------------

app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 

//credenciais de acesso ao banco de dados -----------------------------------------------------------------------------

const sequelize = new Sequelize('linnie2','root','vinimsql', { // colocar a senha quando estiver no meu pc (senha: vinimsql) 
    host:'localhost', 
    dialect:'mysql' 
})
//CONEXÃO COM MYSQL --------------------------------------------------------------------------------------------------

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

// rodando uma consulta ---------------------------------------------------------------------------------------------- 

const results = sequelize.query(

    "SELECT * FROM UserL", 
    { 
      type: sequelize.QueryTypes.SELECT 
    } 
  );
  
  console.log(results) // returned rows


// exporta modulos sequelize e userl -----------------------------------------------------------------------------

  module.exports = { sequelize, Sequelize, DataTypes };