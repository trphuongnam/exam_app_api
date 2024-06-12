import mysql from 'mysql2/promise';
const connectDatabase = mysql.createPool(
  {
    host: '127.0.0.1',
    port: 3306,
    database: 'exam_app',
    user: 'root',
    password: ''
  }
);

export default connectDatabase;
