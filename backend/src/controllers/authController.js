const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TOKEN_EXPIRE_HOURS = Number(process.env.TOKEN_EXPIRE_HOURS || 168);

exports.signup = async (req, res) => {
  const { name, email, password, role='organizer', timezone='UTC' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [r] = await db.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)', [name, email, hash, role]);
    const userId = r.insertId;
    await db.query('INSERT INTO profiles (user_id, timezone) VALUES (?,?)', [userId, timezone]);

    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: `${TOKEN_EXPIRE_HOURS}h` });
    res.json({ token, user: { id: userId, name, email, role } });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const [rows] = await db.query('SELECT id, name, password_hash, role FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: `${TOKEN_EXPIRE_HOURS}h` });
    res.json({ token, user: { id: user.id, name: user.name, email, role: user.role } });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};
