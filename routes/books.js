const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// 添加图书
router.post('/', bookController.addBook);

// 获取图书（两种路径）
router.get('/:isbn', bookController.getBookByISBN);
router.get('/isbn/:isbn', bookController.getBookByISBN);

// 更新图书信息（PUT /books/:isbn）
router.put('/:isbn', bookController.updateBook);

module.exports = router;
