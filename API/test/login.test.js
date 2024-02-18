// login.test.js
import { use, expect as _expect } from 'chai';
import chaiHttp from 'chai-http';
const app = require('../server');

use(chaiHttp);
const expect = _expect;

describe('POST /login', () => {
  it('should return 200 and a success message for valid credentials', (done) => {
    request(app)
      .post('/login')
      .send({ username: 'user', password: 'password' })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Login successful');
        done();
      });
  });

  it('should return 401 for invalid credentials', (done) => {
    request(app)
      .post('/login')
      .send({ username: 'user', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Login failed');
        done();
      });
  });
});
