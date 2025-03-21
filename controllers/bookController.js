const db = require('../db');

function isValidBook(book) {
  const requiredFields = ['ISBN', 'title', 'Author', 'description', 'genre', 'price', 'quantity'];
  for (const field of requiredFields) {
    if (!book[field]) return false;
  }
  // price 两位小数
  if (!/^\d+(\.\d{1,2})?$/.test(book.price.toString())) return false;
  return true;
}

exports.addBook = async (req, res) => {
  const book = req.body;

  if (!isValidBook(book)) {
    return res.status(400).json({ message: 'Invalid or missing fields.' });
  }

  try {
    // 检查 ISBN 是否已存在
    const [rows] = await db.query('SELECT * FROM Books WHERE ISBN = ?', [book.ISBN]);
    if (rows.length > 0) {
      return res.status(422).json({ message: 'This ISBN already exists in the system.' });
    }

    // 插入图书
    const insertQuery = `
      INSERT INTO Books (ISBN, title, Author, description, genre, price, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertQuery, [
      book.ISBN,
      book.title,
      book.Author,
      book.description,
      book.genre,
      book.price,
      book.quantity
    ]);

    res.status(201)
      .location(`/books/${book.ISBN}`)
      .json(book);

  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getBookByISBN = async (req, res) => {
    const isbn = req.params.isbn;
  
    if (!isbn) {
      return res.status(400).json({ message: 'ISBN is required.' });
    }
  
    try {
      const [rows] = await db.query('SELECT * FROM Books WHERE ISBN = ?', [isbn]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Book not found.' });
      }
  
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Error retrieving book:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateBook = async (req, res) => {
    const isbn = req.params.isbn;
    const book = req.body;
  
    // 检查请求体是否包含所有必需字段
    const requiredFields = ['ISBN', 'title', 'Author', 'description', 'genre', 'price', 'quantity'];
    for (const field of requiredFields) {
      if (book[field] === undefined || book[field] === null) {
        return res.status(400).json({ message: 'Invalid or missing fields.' });
      }
    }
  
    // 确保 URL 中的 ISBN 和请求体中的 ISBN 一致
    if (isbn !== book.ISBN) {
      return res.status(400).json({ message: 'ISBN in URL and body do not match.' });
    }
  
    // 验证 price 格式（必须为两位小数，允许整数部分多位）
    if (!/^\d+(\.\d{1,2})?$/.test(book.price.toString())) {
      return res.status(400).json({ message: 'Invalid price format.' });
    }
  
    try {
      // 先查询数据库确认此 ISBN 存在
      const [rows] = await db.query('SELECT * FROM Books WHERE ISBN = ?', [isbn]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Book not found.' });
      }
  
      // 更新图书记录
      const updateQuery = `
        UPDATE Books
        SET title = ?, Author = ?, description = ?, genre = ?, price = ?, quantity = ?
        WHERE ISBN = ?
      `;
      await db.query(updateQuery, [
        book.title,
        book.Author,
        book.description,
        book.genre,
        book.price,
        book.quantity,
        isbn
      ]);
  
      // 返回更新后的数据（这里直接返回请求体内容，或者重新查询后返回都可以）
      res.status(200).json(book);
    } catch (err) {
      console.error('Error updating book:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
};
  