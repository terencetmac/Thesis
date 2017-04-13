require('dotenv').config();
let db = null;
let Users = null;

beforeAll(() => {
  if (process.env.IS_ON === 'development') {
    process.env.DATABASE_URL = 'postgres://@localhost:5432/reflectivetest';
  }
  Users = require('../../server/models/users.js');
  const dbConfig = require('../../db/config.js');
  db = dbConfig.db;
  return dbConfig.loadDb(db);
})

afterAll(() => {
  return db.one("DELETE FROM users WHERE first_name = 'John'");
})

describe('Database exists', () => {
  it('should connect to the database', () => {
    expect(db).toBeDefined();
  })
})

describe('Users table', () => {

  let userId = null;

  it('should have a users table', (done) => {
    db.any('SELECT * FROM users')
      .then(result => {
        done();
      })
      .catch(error => {
        throw error;
      })
  })
  
  it('should add a new user into the table', () => {
    const newUser = {
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Smith',
      password: 'password',
      phone: '123-456-7890',
      phone_verified: false
    }
    return Users.new(newUser)
      .then(user => {
        expect(user.user_id).toBeDefined();
        expect(user.email).toEqual(newUser.email);
        expect(user.first_name).toEqual(newUser.first_name);
        expect(user.last_name).toEqual(newUser.last_name);
        expect(user.phone).toEqual(newUser.phone);
        expect(user.phone_verified).toEqual(newUser.phone_verified);
      });
  })

  it('should find newly added users', () => {
    const email = 'test@example.com';
    return Users.findByEmail(email)
      .then(user => {
        expect(user.first_name).toEqual('John');
        expect(user.last_name).toEqual('Smith');
      })
  })

  it('should have a created timestamp that is defined and a modified timestamp that is undefined', () => {
    return Users.findByPhone('123-456-7890')
      .then(user => {
        expect(user.created).toBeDefined();
        expect(user.modified).toBe(null);
        userId = user.user_id;
      })
  })

  it('should change email when requested and update the modified timestamp', () => {
    return Users.update(userId, 'email', 'test2@example.com')
      .then(user => {
        expect(user[0].email).toBe('test2@example.com');
        expect(user[0].modified).toBeDefined(); 
      })
  })

  it('should delete a user', () => {
    return Users.delete(userId)
      .then(() => {
        return Users.findByPhone('123-456-7890')
      })
      .then((user) => {
        expect(user).toBe(null);
      })
  })
})