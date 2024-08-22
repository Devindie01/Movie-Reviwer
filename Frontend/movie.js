const url = new URL(location.href);
const movieId = url.searchParams.get('id');
const movieTitle = url.searchParams.get('title');

const APILINK = 'https://movie-reviwer.vercel.app';
const main = document.getElementById("section");
const title = document.getElementById("title");

title.innerText = movieTitle;

const div_new = document.createElement('div');
div_new.innerHTML = `
  <div class="row">
    <div class="column">
      <div class="layout">
          <span style="font-size: 20px; font-weight: bold;">New Review</span>
          <p ><strong>Review: </strong>
            <input type="text" id="new_review" value="" style="margin-top: 15px;">
          </p>
          <p ><strong>User: </strong>
            <input type="text" id="new_user" value="" style="margin-top: 15px;">
          </p>
          <p><a href="#" onclick="saveReview('new_review', 'new_user')">💾</a></p>
      </div>
    </div>
  </div>
`;
main.appendChild(div_new);


returnReview(APILINK);

function returnReview(url) {
  fetch(url + "movie/" + movieId)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // Clear existing reviews before appending new ones
      main.querySelectorAll('.card:not(:first-child)').forEach(card => card.remove());
      data.forEach(review => {
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="layout" id="${review._id}">
                <p><strong>Review: </strong>${review.review}</p>
                <p><strong>User: </strong>${review.user}</p>
                <p><a href="#" onclick="editReview('${review._id}', '${review.review}', '${review.user}')">✏️</a> <a href="#" onclick="deleteReview('${review._id}')">🗑</a></p>
              </div>
            </div>
          </div>
        `;
        main.appendChild(div_card);
      });
    });
}

function editReview(id, review, user) {
  const element = document.getElementById(id);
  const reviewInputId = "review" + id;
  const userInputId = "user" + id;

  element.innerHTML = `
    <p><strong>Review: </strong>
      <input type="text" id="${reviewInputId}" value="${review}">
    </p>
    <p><strong>User: </strong>
      <input type="text" id="${userInputId}" value="${user}">
    </p>
    <p><a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">💾</a></p>
  `;
}

function saveReview(reviewInputId, userInputId, id = "") {
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  if (id) {
    // Update existing review
    fetch(APILINK + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review })
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);

      // Update the review card content in the DOM
      const card = document.getElementById(id);
      card.innerHTML = `
        <p><strong>Review: </strong>${review}</p>
        <p><strong>User: </strong>${user}</p>
        <p><a href="#" onclick="editReview('${id}', '${review}', '${user}')">✏️</a> <a href="#" onclick="deleteReview('${id}')">🗑</a></p>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  } else {
    // Add new review
    fetch(APILINK + "new", {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review, "movieId": movieId })
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);

      // Create a new review card and append it to the DOM
      const div_card = document.createElement('div');
      div_card.innerHTML = `
        <div class="row">
          <div class="column">
            <div class="card" id="${res._id}">
              <p><strong>Review: </strong>${review}</p>
              <p><strong>User: </strong>${user}</p>
              <p><a href="#" onclick="editReview('${res._id}', '${review}', '${user}')">✏️</a> <a href="#" onclick="deleteReview('${res._id}')">🗑</a></p>
            </div>
          </div>
        </div>
      `;
      main.appendChild(div_card);
      
      // Clear the input fields
      document.getElementById('new_review').value = '';
      document.getElementById('new_user').value = '';
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}

function deleteReview(id) {
  fetch(APILINK + id, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    document.getElementById(id).remove();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
