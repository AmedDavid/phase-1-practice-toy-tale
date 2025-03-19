let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const baseUrl = "http://localhost:3000/toys";

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  function fetchToys() {
    fetch(baseUrl)
      .then(response => response.json())
      .then(toys => {
        toyCollection.innerHTML = '';
        toys.forEach(toy => renderToyCard(toy));
      })
      .catch(error => console.error('Error fetching toys:', error));
  }

  // Render a single toy card
  function renderToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = toy.id;
    
    const defaultImage = "https://via.placeholder.com/150?text=Toy+Image+Not+Found";
    
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" alt="${toy.name}" onerror="this.src='${defaultImage}'" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn">Like ❤️</button>
    `;
    
    
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => handleLike(toy));
    
    toyCollection.appendChild(card);
  }

  
  function handleLike(toy) {
    const newLikes = toy.likes + 1;
    
    fetch(`${baseUrl}/${toy.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(updatedToy => {
      const card = document.querySelector(`[data-id="${updatedToy.id}"]`);
      if (card) {
        const likesP = card.querySelector('p');
        likesP.textContent = `${updatedToy.likes} Likes`;
        toy.likes = updatedToy.likes;
      }
    })
    .catch(error => console.error('Error updating likes:', error));
  }

  
  toyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(toyForm);
    const imageUrl = formData.get('image');
    const name = formData.get('name');

    const urlPattern = /^(https?:\/\/[^\s]+)/;
    const defaultImage = "https://via.placeholder.com/150?text=New+Toy";

    const newToy = {
      name: name || "Unnamed Toy",
      image: (imageUrl && urlPattern.test(imageUrl)) ? imageUrl : defaultImage,
      likes: 0
    };

    fetch(baseUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      renderToyCard(toy);
      toyForm.reset();
      toyFormContainer.style.display = 'none';
      addToy = false;
    })
    .catch(error => console.error('Error adding toy:', error));
  });

  
  fetchToys();
});




