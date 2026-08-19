const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, role: 'PATIENT' }, 'HEATH_TECH_SECRET_KEY', { expiresIn: '1h' });

fetch('http://localhost:3000/ai/triage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': `acces_token=${token}`
  },
  body: JSON.stringify({ symptoms: 'đau đầu, sốt cao' })
}).then(res => res.json()).then(console.log).catch(console.error);
