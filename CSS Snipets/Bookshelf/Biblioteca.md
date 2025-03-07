## Completed

```dataviewjs
let folderName = "02-Biblioteca/01-Libros/";
let books = dv.pages()
  .filter(p => p.file.path.startsWith(folderName) && p.status === "Completed")
  .sort(p => p.file.name)
  .map(p => ({
    link: `obsidian://open?vault=2ndBrain&file=${encodeURIComponent(p.file.path)}`,
    title: p.file.name,
    author: p.author || "Unknown Author",
    pages: p.pages || "Unknown Pages",
    cover_url: p.cover_url || "https://imgs.search.brave.com/DzOyhFO0fjZ-OnEOqCVIWnV6qHWY_T43bB-bfgHRUFk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0Lzk5LzkzLzMx/LzM2MF9GXzQ5OTkz/MzExN19aQVVCZnYz/UDFIRU9zWkRybmti/TkN0NGpjM0FvZEFy/bC5qcGc"
  }));

// Create a container for the book cards with the grid layout
dv.el('div', `
  <div class="book-card-container">
    ${books.map(book => `
      <div class="book-card">
        <div class="book-cover">
          <a href="${book.link}"> <img src="${book.cover_url}" onerror="this.src='https://via.placeholder.com/120x180?text=No+Cover';"> </a>
        </div>
        <div class="book-details">
          <a href="${book.link}" class="book-title">${book.title}</a>
          <p class="book-author">Author: ${book.author}</p>
          <p class="book-pages">Pages: ${book.pages}</p>
        </div>
      </div>
    `).join('')}
  </div>
`);
```
## Reading
```dataviewjs
let folderName = "02-Biblioteca/01-Libros/";
let books = dv.pages()
  .filter(p => p.file.path.startsWith(folderName) && p.status === "Reading")
  .sort(p => p.file.name)
  .map(p => ({
    link: `obsidian://open?vault=2ndBrain&file=${encodeURIComponent(p.file.path)}`,
    title: p.file.name,
    author: p.author || "Unknown Author",
    pages: p.pages || "Unknown Pages",
    cover_url: p.cover_url || "https://imgs.search.brave.com/DzOyhFO0fjZ-OnEOqCVIWnV6qHWY_T43bB-bfgHRUFk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0Lzk5LzkzLzMx/LzM2MF9GXzQ5OTkz/MzExN19aQVVCZnYz/UDFIRU9zWkRybmti/TkN0NGpjM0FvZEFy/bC5qcGc"
  }));

// Create a container for the book cards with the grid layout
dv.el('div', `
  <div class="book-card-container">
    ${books.map(book => `
      <div class="book-card">
        <div class="book-cover">
          <a href="${book.link}"> <img src="${book.cover_url}" onerror="this.src='https://via.placeholder.com/120x180?text=No+Cover';"> </a>
        </div>
        <div class="book-details">
          <a href="${book.link}" class="book-title">${book.title}</a>
          <p class="book-author">Author: ${book.author}</p>
          <p class="book-pages">Pages: ${book.pages}</p>
        </div>
      </div>
    `).join('')}
  </div>
`);
```

## Unread
```dataviewjs

```
```dataviewjs
let folderName = "02-Biblioteca/01-Libros/";
let books = dv.pages()
  .filter(p => p.file.path.startsWith(folderName) && p.status === "Unread")
  .sort(p => p.file.name)
  .map(p => ({
    link: `obsidian://open?vault=2ndBrain&file=${encodeURIComponent(p.file.path)}`,
    title: p.file.name,
    author: p.author || "Unknown Author",
    pages: p.pages || "Unknown Pages",
    cover_url: p.cover_url || "https://imgs.search.brave.com/DzOyhFO0fjZ-OnEOqCVIWnV6qHWY_T43bB-bfgHRUFk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0Lzk5LzkzLzMx/LzM2MF9GXzQ5OTkz/MzExN19aQVVCZnYz/UDFIRU9zWkRybmti/TkN0NGpjM0FvZEFy/bC5qcGc"
  }));

// Create a container for the book cards with the grid layout
dv.el('div', `
  <div class="book-card-container">
    ${books.map(book => `
      <div class="book-card">
        <div class="book-cover">
          <a href="${book.link}"> <img src="${book.cover_url}" onerror="this.src='https://via.placeholder.com/120x180?text=No+Cover';"> </a>
        </div>
        <div class="book-details">
          <a href="${book.link}" class="book-title">${book.title}</a>
          <p class="book-author">Author: ${book.author}</p>
          <p class="book-pages">Pages: ${book.pages}</p>
        </div>
      </div>
    `).join('')}
  </div>
`);

```

## List of all books

```dataviewjs
let folderName = "02-Biblioteca/01-Libros/";
let books = dv.pages()
  .filter(p => p.file.path.startsWith(folderName))
  .sort(p => p.file.name)
  .map(p => ({
    link: `obsidian://open?vault=2ndBrain&file=${encodeURIComponent(p.file.path)}`,
    title: p.file.name,
    author: p.author || "Unknown Author",
    pages: p.pages || "Unknown Pages",
    cover_url: p.cover_url || "https://imgs.search.brave.com/DzOyhFO0fjZ-OnEOqCVIWnV6qHWY_T43bB-bfgHRUFk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0Lzk5LzkzLzMx/LzM2MF9GXzQ5OTkz/MzExN19aQVVCZnYz/UDFIRU9zWkRybmti/TkN0NGpjM0FvZEFy/bC5qcGc"
  }));

// Create a container for the book cards with the grid layout
dv.el('div', `
  <div class="book-card-container">
    ${books.map(book => `
      <div class="book-card">
        <div class="book-cover">
          <a href="${book.link}"> <img src="${book.cover_url}" onerror="this.src='https://via.placeholder.com/120x180?text=No+Cover';"> </a>
        </div>
        <div class="book-details">
          <a href="${book.link}" class="book-title">${book.title}</a>
          <p class="book-author">Author: ${book.author}</p>
          <p class="book-pages">Pages: ${book.pages}</p>
        </div>
      </div>
    `).join('')}
  </div>
`);
```