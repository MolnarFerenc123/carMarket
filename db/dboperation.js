const mysql = require("mysql2");
var config = require('./dbconfig');

const pool = mysql.createPool(config);

async function Select30(pageNo) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM alldata ORDER BY gyarto, modell, ev LIMIT 30 OFFSET ? ', pageNo * 30, (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectAll() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM alldata ORDER BY gyarto, modell, ev', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectOne(carId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM alldata WHERE id = ? ORDER BY gyarto, modell, ev',[carId], (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectAllSpecial() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM kulonleges', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function CountElements() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT COUNT(*) AS `elemdb` FROM auto', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectAllMake() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM gyarto ORDER BY gyarto', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectAllCondition() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM allapot ORDER BY allapot', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};



async function SelectAllColor() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM szin ORDER BY szin', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectAllFuel() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM uzemanyag  ORDER BY uzemanyag', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectAllType() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM kivitel  ORDER BY kivitel', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectAllTransmission() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM valto ORDER BY valto', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectAllDrive() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM meghajtas ORDER BY meghajtas', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectModelByMake() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT DISTINCT gy.id, a.modell from auto a, gyarto gy WHERE a.gyartoid = gy.id ORDER BY gy.id, a.modell', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectMinPrice() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT MIN(ar) AS minAr FROM auto', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectMaxPrice() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT MAX(ar) AS maxAr FROM auto', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectMinYear() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT MIN(ev) AS minEv FROM auto', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectMaxYear() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT MAX(ev) AS maxEv FROM auto', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function VerifyUser(username, password) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users where username=? and password=titkosit(?)',
            [username, password], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

async function NewUser(username, password, name, email, letters) {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO users (username, password, name, email, jog, hirlevel)
        VALUES (?, titkosit(?), ?, ?, 1, ?);`,
            [username, password, name, email, letters], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

async function CheckUsed(username, email) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users
        WHERE username = ? OR email = ?`,
            [username, email], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

async function NewFavorite(userId, carId) {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO favorites(userId, carId) VALUES (?, ?)`,[userId, carId], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

async function RemoveFavorite(userId, carId) {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM favorites WHERE userId = ? AND carId = ?`,[userId, carId], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};


async function Favorites(userId) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT a.id, a.gyarto, a.modell, a.ar, a.km, a.ev FROM alldata a, favorites f, users u
        WHERE u.id = f.userId AND f.carId = a.id
        AND u.id = ? ORDER BY a.gyarto, a.modell, a.ev`,userId, (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

async function CheckFavorite(userId,carId) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM favorites f
        WHERE f.userId = ? AND f.carId = ?`,[userId,carId], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

async function Filter(make, models, years, prices, conditions, colors, fuels, types, transmissions, drives) {
    return new Promise((resolve, reject) => {
        let toCheck = [];
        let sql = `SELECT
        a.id AS id, gy.gyarto AS gyarto, a.modell AS modell, a.ev AS ev, a.ar AS ar, al.allapot AS allapot, sz.szin AS szin, a.hengerfej AS hengerfej, u.uzemanyag AS uzemanyag, a.km AS km, v.valto AS valto, a.alvaz AS alvaz, m.meghajtas AS meghajtas, k.kivitel AS kivitel
      FROM auto a, allapot al, gyarto gy, kivitel k, meghajtas m, szin sz, uzemanyag u, valto v
      WHERE a.gyartoid = gy.id AND a.allapotid = al.id AND a.szinid = sz.id AND a.uzemanyagid = u.id AND a.valtoid = v.id AND a.meghajtasid = m.id AND a.kivitelid = k.id`;
        if (make != "all") {
            sql += ` AND gy.id = ?`;
            toCheck.push(make);
        }
        if(models.length > 0){
            sql += ` AND a.modell IN (?)`
            toCheck.push(models);
        }
        sql += ` AND a.ev BETWEEN ? AND ?`;
        toCheck.push(years[0]);
        toCheck.push(years[1]);
        sql += ` AND a.ar BETWEEN ? AND ?`;
        toCheck.push(prices[0]);
        toCheck.push(prices[1]);
        if(conditions.length > 0){
            sql += ` AND al.id IN (?)`
            toCheck.push(conditions);
        }
        if(colors.length > 0){
            sql += ` AND sz.id IN (?)`
            toCheck.push(colors);
        }
        if(fuels.length > 0){
            sql += ` AND u.id IN (?)`
            toCheck.push(fuels);
        }
        if(types.length > 0){
            sql += ` AND k.id IN (?)`
            toCheck.push(types);
        }
        if(transmissions.length > 0){
            sql += ` AND v.id IN (?)`
            toCheck.push(transmissions);
        }
        if(drives.length > 0){
            sql += ` AND m.id IN (?)`
            toCheck.push(drives);
        }
        sql += ' ORDER BY gy.gyarto, a.modell, a.ev;';
        pool.query(sql, toCheck,
            (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

module.exports = {
    SelectMinPrice: SelectMinPrice,
    SelectMaxPrice: SelectMaxPrice,
    SelectMinYear: SelectMinYear,
    SelectMaxYear: SelectMaxYear,
    SelectAllMake: SelectAllMake,
    SelectAllCondition: SelectAllCondition,
    SelectAll: SelectAll,
    SelectOne: SelectOne,
    Select30: Select30,
    CountElements: CountElements,
    SelectAllColor: SelectAllColor,
    SelectAllDrive: SelectAllDrive,
    SelectAllTransmission: SelectAllTransmission,
    SelectAllType: SelectAllType,
    SelectAllFuel: SelectAllFuel,
    SelectModelByMake: SelectModelByMake,
    SelectAllSpecial: SelectAllSpecial,
    NewUser: NewUser,
    VerifyUser: VerifyUser,
    CheckUsed: CheckUsed,
    Filter: Filter,
    NewFavorite : NewFavorite,
    Favorites : Favorites,
    CheckFavorite : CheckFavorite,
    RemoveFavorite: RemoveFavorite
}