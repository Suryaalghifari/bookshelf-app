const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

const bookForm = document.getElementById("bookForm");
const searchForm = document.getElementById("searchBook");
const incompleteList = document.getElementById("incompleteBookList");
const completeList = document.getElementById("completeBookList");

function isStorageExist() {
  return typeof Storage !== "undefined";
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
}

function renderBooks(bookFilter = "") {
  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(bookFilter.toLowerCase())
  );

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeList.appendChild(bookElement);
    } else {
      incompleteList.appendChild(bookElement);
    }
  }

  updateBookStats();
}

function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");
  bookItem.classList.add("book-item");

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle" class="book-title">${book.title}</h3>
    <p data-testid="bookItemAuthor" class="book-meta">Penulis: ${
      book.author
    }</p>
    <p data-testid="bookItemYear" class="book-meta">Tahun: ${book.year}</p>
    <div class="book-actions">
      <button data-testid="bookItemIsCompleteButton" class="btn btn-success">
        ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
      </button>
      <button data-testid="bookItemDeleteButton" class="btn btn-danger">Hapus Buku</button>
      <button data-testid="bookItemEditButton" class="btn btn-warning">Edit Buku</button>
    </div>
  `;

  const [toggleBtn, deleteBtn, editBtn] = bookItem.querySelectorAll("button");

  toggleBtn.addEventListener("click", () => toggleBook(book.id));
  deleteBtn.addEventListener("click", () => deleteBook(book.id));
  editBtn.addEventListener("click", () => editBook(book.id));

  return bookItem;
}

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };

  books.push(newBook);
  saveData();
  renderBooks();
  bookForm.reset();
});

function toggleBook(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveData();
  renderBooks();
}

function editBook(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  books = books.filter((b) => b.id !== id);
  saveData();
  renderBooks();
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchBookTitle").value;
  renderBooks(query);
});

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadData();
    renderBooks();
  }
});
function updateBookStats() {
  const incomplete = books.filter((b) => !b.isComplete).length;
  const complete = books.filter((b) => b.isComplete).length;

  document.getElementById("incompleteBadge").textContent = incomplete;
  document.getElementById("completeBadge").textContent = complete;

  document.getElementById("incompleteCount").textContent = incomplete;
  document.getElementById("completeCount").textContent = complete;
}
