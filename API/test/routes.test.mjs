import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js'; // Assuming your server file is named 'server.js'

const chai = use(chaiHttp);

describe('Login Endpoint Test:', () => {
  it('should return status 200 and a success message with valid credentials', async () => {
    const res = await chai.request(app)
      .post('/api/login')
      .send({ username: 'test_username', password: 'test_password' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message').to.equal('Login successful!');
  });

  it('should return status 401 with invalid credentials', async () => {
    const res = await chai.request(app)
      .post('/api/login')
      .send({ username: 'invalid_username', password: 'invalid_password' });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('message').to.equal('Invalid credentials.');
  });
});

describe('Signup Endpoint Test:', () => {
  it('should return status 200 and a success message with valid signup', async () => {
    const res = await chai.request(app)
      .post('/api/signup')
      .send({ username: 'new_username', password: 'new_password', firstname: 'new_firstname', lastname: 'new_lastname' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message').to.equal('Signup successful!');
  });

  it('should return status 401 with invalid credentials', async () => {
    const res = await chai.request(app)
      .post('/api/signup')
      .send({ username: 'new_username', password: 'new_password', firstname: 'new_firstname', lastname: 'new_lastname' });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('message').to.equal('Invalid credentials. Username already in use.');
  });

});
