const supertest = require('supertest');
const app = require('../src/app');
const db = require('../src/database');

const cleanDataBase = async() => {
  await db.query('DELETE FROM tests');
}

beforeAll(cleanDataBase);

afterAll(async () => {
  await cleanDataBase;
  db.end();
});

describe('POST /createTest', () => {
  it ('should return status 201 when sucess to create new test', async () => {
    
    const body = {
      name: 'Teste prova 2020', 
      idPeriod: 2, 
      idUniversity: 1, 
      idSubject: 1, 
      idTypeTest: 1, 
      idTeacher: 1, 
      url: 'https://dbdiagram.io/home'
    }

    const response = await supertest(app).post('/api/createTest').send(body);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(body);
  });

  it ('should return status 422 when send wrong type params', async () => {
    
    const body = {
      name: 'Teste prova 2020', 
      idPeriod: "aza", 
      idUniversity: "xax", 
      idSubject: "xsa", 
      idTypeTest: "xsa", 
      idTeacher: "xas", 
      url: 'https://dbdiagram.io/home'
    }

    const response = await supertest(app).post('/api/createTest').send(body);
    expect(response.status).toBe(422);
  });

  it ('should return status 422 when send html at url', async () => {
    
    const body = {
      name: '<p>Test<p>', 
      idPeriod: 2, 
      idUniversity: 1, 
      idSubject: 1, 
      idTypeTest: 1, 
      idTeacher: 1, 
      url: '<script>https://dbdiagram.io/home<script>'
    }

    const response = await supertest(app).post('/api/createTest').send(body);
    expect(response.status).toBe(422);
  });

  it ('should return status 201 when send html at name and return sanitized', async () => {
    
    const body = {
      name: '<p>Test<p>', 
      idPeriod: 2, 
      idUniversity: 1, 
      idSubject: 1, 
      idTypeTest: 1, 
      idTeacher: 1, 
      url: 'https://dbdiagram.io/home'
    }

    const bodyResponse = {
      name: 'Test', 
      idPeriod: 2, 
      idUniversity: 1, 
      idSubject: 1, 
      idTypeTest: 1, 
      idTeacher: 1, 
      url: 'https://dbdiagram.io/home'
    }

    const response = await supertest(app).post('/api/createTest').send(body);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(bodyResponse);
    expect(response.body).toHaveProperty('id');
  });
});
