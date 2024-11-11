document.getElementById("recipeForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const image = document.getElementById("image").files[0]?.name || ''; 
  const description = document.getElementById("description").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim();
  const instructions = document.getElementById("instructions").value.trim();
  const prepTime = document.getElementById("prep-time").value.trim();
  const extras = document.getElementById("extras").value.trim();
  const specialNote = document.getElementById("special-note").value.trim();

  if (!title || !description || !ingredients || !instructions) {
    alert("Please fill out all required fields!");
    return;
  }

  if (isNaN(prepTime) || prepTime === "") {
    alert("Please enter a valid number for preparation time.");
    return;
  }

  const formData = {
    title,
    image,
    description,
    ingredients,
    instructions,
    prepTime: parseFloat(prepTime),
    extras,
    specialNote,
  };

  const userId = localStorage.getItem('userId');  

  if (!userId) {
    alert("User ID is required.");
    return;
  }

  formData.userId = userId;  

  try {
    const response = await fetch('http://localhost:3000/add-dish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });


    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      console.log('Dish added:', data);
    } else {

      const text = await response.text();
      console.error('Error: Non-JSON response:', text);
      alert("There was an error while adding the dish. Please try again.");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("There was an error while adding the dish.");
  }
});
