function generateBookHTML(book, index) {
  return `
    <div class="book">
      <div class="book-header">
        <div class="book-name">
          <h2>${book.name}</h2>
        </div>
      </div>
      
      <div class="book-image">
        <img src="./assets/icons/book.jpg" alt="${book.name}" />
      </div>
      
      <div class="book-info">
        <div class="book-price">€${book.price.toFixed(2)}</div>
        <div class="book-like-area">
        <div class="book-likes">${book.likes}</div>
       <div class="book-likes-btn btn ${book.liked ? 'liked' : 'not-liked'}" onclick="likeBook(${index})">
          <img src="./assets/icons/like.png" alt="Like">
        </div>
      </div>
        
        <div class="book-meta">
          <strong>Author:</strong>
          <span>${book.author}</span>
          <strong>Erscheinungsjahr:</strong>
          <span>${book.publishedYear}</span>
          <strong>Genre:</strong>
          <span>${book.genre}</span>
        </div>
      </div>
      
      <div class="comments">
        <h3>Kommentare:</h3>
        ${generateCommentsHTML(book.comments)}

        <h3>Kommentar hinzufügen:</h3>
        <div class="add-comment">
          <input type="text" placeholder="Dein Name" id="name-input-${index}" />
          <textarea placeholder="Dein Kommentar" id="comment-input-${index}"></textarea>
          <button onclick="addComment(${index})">Kommentar hinzufügen</button>
        </div>
      </div>
    </div>
  `;
}

