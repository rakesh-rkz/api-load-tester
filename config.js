const apiUrl = 'http://localhost:5000/api';
module.exports = {
  concurrentRequests: 50,
  totalRequests: 500,
  timeout: 10000,

  endpoints: [
    {
      name: 'Create User',
      url: `${apiUrl}/users`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payloads: require('./payloads/users.json')
    },
    {
      name: 'Login',
      url: `${apiUrl}/login`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payloads: require('./payloads/login.json')
    },
    {
      name: 'Fetch Products',
      url: `${apiUrl}/products`,
      method: 'GET',
      headers: {}
    }
  ]
};
