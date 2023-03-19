/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const getBookByNameQuery = books.filter((b) => {
      const bookName = JSON.stringify(b.name).toLowerCase();
      const queryName = name.toLowerCase();

      return bookName.includes(queryName);
    });

    const queryNameBook = getBookByNameQuery.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return ({
      status: 'success',
      data: {
        books: queryNameBook,
      },
    });
  }

  if (reading !== undefined) {
    let getBookByReadingQuery = null;

    if (+reading === 0 || +reading === 1) {
      getBookByReadingQuery = books.filter((b) => b.reading === !!+reading);
    } else {
      getBookByReadingQuery = books;
    }

    const readingQueryBook = getBookByReadingQuery.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return ({
      status: 'success',
      data: {
        books: readingQueryBook,
      },
    });
  }

  if (finished !== undefined) {
    let getBookByFinishedQuery = null;

    if (+finished === 0 || +finished === 1) {
      getBookByFinishedQuery = books.filter((b) => b.finished === !!+finished);
    } else {
      getBookByFinishedQuery = books;
    }

    const finishedQueryBook = getBookByFinishedQuery.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return ({
      status: 'success',
      data: {
        books: finishedQueryBook,
      },
    });
  }

  const newBook = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return {
    status: 'success',
    data: {
      books: newBook,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const finished = readPage === pageCount;
  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
