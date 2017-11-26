$(document).ready(function() {
  for (var i in localStorage) {
    displayIdea(i);
  }
});


//EVENT LISTENERS
$('.card-container').on('blur', 'article h2', function () { editCard(event); });
$('.card-container').on('blur', 'article p', function() { editCard(event); });
$('#description-input').on('keyup', enabledButton);
$('#title-input').focus();
$('.save-btn').on('click', function(e) {
  e.preventDefault();
  missingInput();
  });
$('#title-input').on('keyup', enabledButton); 
$('#search').on('keyup', function() {
  searchTitle();
  searchBody();
});

function putIntoStorage(object) {
  var string = JSON.stringify(object);
  localStorage.setItem(object['id'], string);
} 

function editCard(event) {
  var cardID = event.target.closest('.container').id;
  var pullCardID = localStorage.getItem(cardID);
  var parsedCardId = JSON.parse(pullCardID);
  parsedCardId.title = $(`#${cardID} h2`).text();
  parsedCardId.body = $(`#${cardID} p`).text();
  putIntoStorage(parsedCardId);
}

$('.card-container').on('click', '.upvote', function() {
  var cardQuaility = $(this).closest('article');
  var cardID = $(cardQuaility).attr('id');
  var pullCardID = localStorage.getItem(cardID);
  var pasrsedCardId = JSON.parse(pullCardID);
  var qualityDisplay = $(this).siblings('h3').find('.qualityValue');
  if (qualityDisplay.text() === 'swill') {
    qualityDisplay.text('plausible');
    pasrsedCardId.quality = 'plausible';
   
  }
  else if (qualityDisplay.text() === 'plausible') {
    qualityDisplay.text('genius');
    pasrsedCardId.quality = 'genius';
  }
    var qualityStringify = JSON.stringify(pasrsedCardId);
    var storeQuaility = localStorage.setItem(cardID, qualityStringify);
});

$('.card-container').on('click', '.downvote', function() {
  var cardQuaility = $(this).closest('article');
  var cardID = $(cardQuaility).attr('id');
  var pullCardID = localStorage.getItem(cardID);
  var pasrsedCardId = JSON.parse(pullCardID);
  var qualityDisplay = $(this).siblings('h3').find('.qualityValue');
  if (qualityDisplay.text() === 'genius') {
    qualityDisplay.text('plausible');
    pasrsedCardId.quality = 'plausible';
    
  }
  else if (qualityDisplay.text() === 'plausible') {
    qualityDisplay.text('swill');
    pasrsedCardId.quality = 'swill';
    }
    var qualityStringify = JSON.stringify(pasrsedCardId);
    var storeQuaility = localStorage.setItem(cardID, qualityStringify);
});

$('.card-container').on( 'click', '.delete', function() {
  removeCard(this);
});

//FUNCTIONS

function StoreCard(title, body, id, quality) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = quality;
}

function missingInput() {
  var $title = $('#title-input').val();
  var $body = $('#description-input').val();
  console.log($title);
  if ($title === '') {
    $('.title-missing-field').text('Missing title');
    $('.body-missing-field').text('');
  }
  else if ($body === '') {
    $('.body-missing-field').text('Missing description');
    $('.title-missing-field').text('');
  }
  else {
    $('.body-missing-field').text('');
    $('.title-missing-field').text('');
    storeIdea();
    clearInput();
  }
}

function storeIdea() {
  var $title = $('#title-input').val();
  var $body = $('#description-input').val();
  var $id = Date.now();
  var $quality = 'swill';
  var storeCard = new StoreCard($title, $body, $id, $quality);
  var stringified = JSON.stringify(storeCard);
  localStorage.setItem($id, stringified);
  displayIdea($id);
}

function displayIdea(id) {
  var retreivedArray = JSON.parse(localStorage.getItem(id));
  var title = retreivedArray.title;
  var body = retreivedArray.body;
  var id = retreivedArray.id;
  var quality = retreivedArray.quality;
  createIdea(title, body, id, quality);
}

function createIdea(title, body, id, quality) {
  $('.card-container').prepend(
    `<article class="container" id ="${id}">
      <h2 contenteditable="true">${title}</h2>
      <div class="circle delete"></div>
      <p id="body" contenteditable="true">${body}</p>
      <h3>quality: <span class="qualityValue">${quality}</span></h3>
      <div class="circle upvote"> </div>
      <div class="circle downvote"> </div>
      <hr>
    </article>`)
}

function clearInput() {
  $('#description-input').val('');
  $('#title-input').val('');
  $('#title-input').focus();
}

function enabledButton() {
$('.save-btn').attr('disabled', false);
}

function searchTitle() {
 var $searchValue = $('#search').val().toLowerCase();
 var $cardsTitle = $('article h2');
 $.each($cardsTitle, function(index, value){
  var $cardsLowerCase = $(value).text().toLowerCase();
  if ($cardsLowerCase.includes($searchValue) === true) {
  var cardShow = $(value).parent('article');
  cardShow.show();
  } 
else {
  var cardShow = $(value).parent('article');
  cardShow.hide();
  }
 })
}

function searchBody() {
 var $searchValue = $('#search').val().toLowerCase();
 var $cardsBody = $('article p');
 $.each($cardsBody, function(index, value) {
  var $cardsLowerCase = $(value).text().toLowerCase();
  if ($cardsLowerCase.includes($searchValue) === true) {
  var cardShow = $(value).parent('article');
  cardShow.show();
  } 
  else {
    var cardShow = $(value).parent('article');
    cardShow.hide();
    }
  })
}

function removeCard(e) {
  var cardToDel = $(e).closest('article');
  var cardID = $(cardToDel).attr('id');
  localStorage.removeItem(cardID)
  cardToDel.remove();
}