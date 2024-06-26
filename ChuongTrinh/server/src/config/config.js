import mysql2 from 'mysql2';

module.exports = {
    // development: {
    //     username: 'uztnf0ppw2uklml6',
    //     password: 'DSrbsHEVxuPwQdq6GwH8',
    //     database: 'b8gv9mcbebmlxny0wlsw',
    //     host: 'b8gv9mcbebmlxny0wlsw-mysql.services.clever-cloud.com',
    //     port: '3306',
    //     dialect: 'mysql',
    //     dialectModule: mysql2,
    // },
    development: {
        username: 'root',
        password: '12345678',
        database: 'store',
        host: 'localhost',
        port: '3306',
        dialect: 'mysql',
        dialectModule: mysql2,
    },
    test: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql',
        dialectModule: mysql2,
    },
    production: {
        username: 'uztnf0ppw2uklml6',
        password: 'DSrbsHEVxuPwQdq6GwH8',
        database: 'b8gv9mcbebmlxny0wlsw',
        host: 'b8gv9mcbebmlxny0wlsw-mysql.services.clever-cloud.com',
        port: '3306',
        dialect: 'mysql',
        dialectModule: mysql2,
    },
};
