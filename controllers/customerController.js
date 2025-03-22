const db = require('../db');

// 验证 email 格式
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 验证 2 字母州名
function isValidState(state) {
  return /^[A-Z]{2}$/.test(state);
}

exports.addCustomer = async (req, res) => {
  const c = req.body;

  const requiredFields = ['userId', 'name', 'phone', 'address', 'city', 'state', 'zipcode'];

  for (const field of requiredFields) {
    if (!c[field]) {
      return res.status(400).json({ message: `Missing required field: ${field}` });
    }
  }

  if (!isValidEmail(c.userId)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!isValidState(c.state)) {
    return res.status(400).json({ message: 'Invalid state format.' });
  }

  try {
    // 检查 userId 是否已存在
    const [rows] = await db.query('SELECT * FROM Customers WHERE userId = ?', [c.userId]);
    if (rows.length > 0) {
      return res.status(422).json({ message: 'This user ID already exists in the system.' });
    }

    // 插入顾客
    const result = await db.query(
      `INSERT INTO Customers (userId, name, phone, address, address2, city, state, zipcode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.userId, c.name, c.phone, c.address, c.address2 || null, c.city, c.state, c.zipcode]
    );

    const insertedId = result[0].insertId;

    // 返回顾客信息
    const newCustomer = {
      id: insertedId,
      ...c
    };

    res.status(201)
      .location(`/customers/${insertedId}`)
      .json(newCustomer);
  } catch (err) {
    console.error('Error inserting customer:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCustomerById = async (req, res) => {
    const id = req.params.id;
  
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Invalid or missing ID.' });
    }
  
    try {
      const [rows] = await db.query('SELECT * FROM Customers WHERE id = ?', [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
  
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Error retrieving customer by ID:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCustomerByUserId = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId query parameter.' });
    }

    if (!isValidEmail(userId)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
      const [rows] = await db.query('SELECT * FROM Customers WHERE userId = ?', [userId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
  
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Error retrieving customer by userId:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
  