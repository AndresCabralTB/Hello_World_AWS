// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "test/secretmanager/key";

const client = new SecretsManagerClient({
  region: "us-east-1",
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    })
  );
} catch (error) {
  // For a list of exceptions thrown, see
  // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
  throw error;
}

const secret = response.SecretString;

// Your code goes here

const mysql = require('mysql2');
// create a new MySQL connection
const connection = mysql.createConnection({
  host     : 'first-database-test-1.ccta2ec4yvaj.us-east-1.rds.amazonaws.com',
  port     : '3306',
  user     : 'admin',
  password : secret,
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

// let sql = "INSERT INTO first_table(Name, Lastname, ID) VALUES ('Bingo', 'Cabral', '005')";
let sql = `
  INSERT INTO first_table (Name, Lastname, ID)
  VALUES 
    ('Helena', 'Reyes', '001'),
    ('Joaquín', 'Cabral P', '002')
`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });


// close the MySQL connection
connection.end();
