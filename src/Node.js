const mysql = require('mysql2');
// create a new MySQL connection
const connection = mysql.createConnection({
  host     : 'first-database-test-1.ccta2ec4yvaj.us-east-1.rds.amazonaws.com',
  port     : '3306',
  user     : 'acabralreyes',
  password : 'CleopatraSJFD2.',
  database : 'new_schema'

});
// connect to the MySQL database
connection.connect((error)=>{
if(error){
console.error('Error connecting to MySQL database:', error);
}else{
console.log('Connected to MySQL database!');
}
});
// close the MySQL connection
connection.end();