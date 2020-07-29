// Let's send a request to Pixabay server        
function askPixabay(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.addEventListener("load", function () {
      if (req.status >= 200 && req.status < 400) {
          callback(req.responseText);
      } else {
          console.error(req.status + " " + req.statusText + " " + url);
      }
  });
  req.addEventListener("error", function () {
      console.error("Erreur réseau avec l'URL " + url);
  });
  req.send(null);
}
askPixabay('https://pixabay.com/api/?key=5269301-bef3b751630a73b9484df9549&q=cat&image_type=photo', function(jsonfile){
  let pixabay = JSON.parse(jsonfile);
  // Let's collect all the images, their positions and their captions in arrays
  let slideArray = [];
  let slideNumberArray = [];
  let modalSlideArray_1024 = []; // contains the pixabay images at 1024px, instead of original dimension (1280px)
  let pixabayPagesArray = [];
  let thumbnailDivArray = [];
  let thumbnailsArray = [];
  for (let a=0; a < pixabay.hits.length; a++) {
    slideArray.push(pixabay.hits[a].webformatURL);
    modalSlideArray_1024.push(pixabay.hits[a].largeImageURL.replace("_1280.", "_1024."))
    pixabayPagesArray.push(pixabay.hits[a].pageURL);
    slideNumberArray.push(a+1);
  };


  // Let's create the slides and captions
  let slideContainer = document.createElement('div'); //image container 
  slideContainer.className = "slidecontainer col-xs-8";
  let slide = document.createElement('img'); //image at 640px
  let modalSlide = document.createElement('img'); // image at 1024px
  slide.className = 'slide';
  modalSlide.className = 'modalslide';
  let slideSource = document.createAttribute("src");
  let modalSlideSource = document.createAttribute('src');
  slideSource.value = slideArray[0];
  modalSlideSource.value = modalSlideArray_1024[0]
  slide.setAttributeNode(slideSource);
  modalSlide.setAttributeNode(modalSlideSource);
  let slideNumber = document.createElement('p'); //image number 
  slideNumber.className = 'slidenumber col-xs-6 col-xs-offset-1';
  let magnifier = document.createElement('span');
  magnifier.className='magnifier';
  magnifier.innerHTML = '&#128269;';
  slideContainer.append(slide, modalSlide, magnifier);
  let buttons = document.createElement('row');
  buttons.className = 'buttons row';
  let previousButton = document.createElement('a');
  previousButton.innerHTML = '&#8882;';
  previousButton.className = 'previous col-xs-2';
  let nextButton = document.createElement('a');
  nextButton.innerHTML = '&#8883;';
  nextButton.className = 'next col-xs-2 col-xs-offset-1';
  slideNumber.innerHTML =  '<span class="currentslidenumber">' + slideNumberArray[0] + '</span>' + ' / ' + slideArray.length ;
  buttons.append(previousButton, slideNumber, nextButton);
  let captionContainer = document.createElement('div');// image caption container
  let imagePage = document.createElement('a'); // image source url
  imagePage.text = 'Pixabay';
  imagePage.title = 'Voir cette image sur Pixabay';
  imagePage.href = pixabayPagesArray[0];
  imagePage.target = '_blank';
  captionContainer.className = 'captioncontainer col-xs-4';
  let caption = document.createElement('row'); // image caption
  caption.className = 'caption row';
  captionContainer.append(caption, buttons);
  caption.innerHTML = '<div class="caption col-xs-12">' + '<p class="imagesource">' + 'Source: ' + '<a href=" ' +  imagePage.href + '" title="' + imagePage.title + '" target="' + imagePage.target + '">' + imagePage.text + '</a>' + '</p>' + '<p class="imagetags">' + 'Tags: ' + pixabay.hits[0].tags + '</p>' + '<p class="imageviews">' + 'Vues: ' + pixabay.hits[0].views + '</p>' + '<p class="imagedownloads">' + 'Téléchargements: ' + pixabay.hits[0].downloads + '</p>' + '<p class="imagelikes">' + 'Likes: ' + pixabay.hits[0].likes + '</p>' + '</div>';
  // Let's create the thumbnails
  let thumbnailsContainer = document.createElement('div');
  thumbnailsContainer.className = 'thumbnailscontainer col-xs-12'
  let thumbnailsRow = document.createElement('row');
  thumbnailsRow.className = 'thumbnailsrow';
  thumbnailsRow.append(thumbnailsContainer);
  for (let b=0; b<pixabay.hits.length; b++) {
    let thumbnail = document.createElement('img');
    thumbnail.className = 'thumbnailimg';
    let thumbnailSrc = document.createAttribute('src');
    thumbnailSrc.value = pixabay.hits[b].previewURL;
    thumbnail.setAttributeNode(thumbnailSrc);
    thumbnailsArray.push(thumbnail);
    let thumbnailDiv = document.createElement('div');
    thumbnailDiv.className = 'thumbnaildiv'
    thumbnailDivArray.push(thumbnailDiv);
    thumbnailsContainer.append(thumbnailDivArray[b]);
    thumbnailDivArray[b].append(thumbnailsArray[b]);
  }
  thumbnailDivArray[0].style.transform = 'rotateY(180deg)';

  let album = document.querySelector('#album');
  album.classList.add('container-fluid');
  let slideRow = document.createElement('row');
  slideRow.className = 'sliderow';
  slideRow.append(slideContainer, captionContainer)
  album.append(slideRow,thumbnailsRow);

  // Let's make the slides change when the user clicks on next/previous buttons
  let i = 0; // i = index of active slide
  let x= 0; // x = index of active thumbnail
    y = undefined; // previously active thumbnail

  function nextSlide() {
    if (i <= (slideArray.length-2) || i <= (modalSlideArray_1024.length-2)) { // every time the user clicks on next button, until she reaches the one before the last(18th/19)...
      i = i + 1; // activate every slide that follow the current one (increase)
    } else if (i === (slideArray.length-1)) { // if the user reaches the last slide (19th)... 
      i = 0;// make the first slide active (reset)
    } 
    slideSource.value =  slideArray[i];
    modalSlideSource.value = modalSlideArray_1024[i];
    slideNumber.innerHTML = '<span class="currentslidenumber">' + slideNumberArray[i] + '</span>' + '/' + slideNumberArray.length ;
    imagePage.href = pixabayPagesArray[i]
    caption.innerHTML = '<div class="caption col-xs-12">' + '<p class="imagesource">' + 'Source: ' + '<a href=" ' +  imagePage.href + '" title="' + imagePage.title + '" target="' + imagePage.target + '">' + imagePage.text + '</a>' + '</p>' + '<p class="imagetags">' +  'Tags: ' + pixabay.hits[i].tags + '</p>' + '<p class="imageviews">' + 'Vues: ' + pixabay.hits[i].views + '</p>' + '<p class="imagedownloads">' + 'Téléchargements: ' + pixabay.hits[i].downloads + '</p>' + '<p class="imagelikes">' + 'Likes: ' + pixabay.hits[i].likes + '</p>' + '</div>';
    y = x; // make the currently active thumbnail become the previously active thumbnail  
    thumbnailDivArray[y].style.transform = 'skewY(10deg)'; // back to normal 
    x = i; // make the newly active thumbnail match the current slide
    thumbnailDivArray[x].style.transform = 'rotateY(180deg)'; //
  }

  function previousSlide() {
    if ((i <= slideArray.length) && ( !(i === 0)) || (i <= modalSlideArray_1024.length) && ( !(i === 0))) { // every time the user clicks on previous button, until he reaches the second slide...
      i = i - 1; // activate the slide that precede the current one (decrease)
    } else { // if the current slide is the first image...   
      i = (slideArray.length-1);// Display the last image  
    }
    slideSource.value= slideArray[i];
    modalSlideSource.value = modalSlideArray_1024[i];
    slideNumber.innerHTML = '<span class="currentslidenumber">' + slideNumberArray[i] + '</span>' + '/' + slideNumberArray.length ;
    imagePage.href = pixabayPagesArray[i]
    caption.innerHTML = '<div class="caption col-xs-12">' + '<p class="imagesource">' + 'Source: ' + '<a href=" ' +  imagePage.href + '" title="' + imagePage.title + '" target="' + imagePage.target + '">' + imagePage.text + '</a>' + '</p>' + '<p class="imagetags">' + 'Tags: ' + pixabay.hits[i].tags + '</p>' + '<p class="imageviews">' + 'Vues: ' + pixabay.hits[i].views + '</p>' + '<p class="imagedownloads">' + 'Téléchargements: ' + pixabay.hits[i].downloads + '</p>' + '<p class="imagelikes">' + 'Likes: ' + pixabay.hits[i].likes + '</p>' + '</div>';
    y = x; // make the currently active thumbnail become the previously active thumbnail  
    thumbnailDivArray[y].style.transform = 'skewY(10deg)';
    x = i; // make the newly active thumbnail match the current slide
    thumbnailDivArray[x].style.transform = 'rotateY(180deg)';
  };

  nextButton.addEventListener('click', nextSlide);
  previousButton.addEventListener('click', previousSlide);


  // When the user clicks on a thumbnail, let's display the thumbnails' image into the slideshow
  for (let c in thumbnailsArray) { 
    thumbnailsArray[c].addEventListener('click', function displayInSlide(){
      slideSource.value = slideArray[c];
      modalSlideSource.value = modalSlideArray_1024[c];
      slideNumber.innerHTML =  '<span class="currentslidenumber">' + slideNumberArray[c] + '</span>' + '/' + slideNumberArray.length ;
      imagePage.href = pixabayPagesArray[c]
      caption.innerHTML = '<div class="caption col-xs-12">' + '<p class="imagesource">' + 'Source: ' + '<a href=" ' +  imagePage.href + '" title="' + imagePage.title + '" target="' + imagePage.target + '">' + imagePage.text + '</a>' + '</p>' + '<p class="imagetags">' + 'Tags: ' + pixabay.hits[c].tags + '</p>' + '<p class="imageviews">' + 'Vues: ' + pixabay.hits[c].views + '</p>' + '<p class="imagedownloads">' + 'Téléchargements: ' + pixabay.hits[c].downloads + '</p>' + '<p class="imagelikes">' + 'Likes: ' + pixabay.hits[c].likes + '</p>' + '</div>';
      thumbnailDivArray[x].style.transform = 'skewY(10deg)'; // make the currently active thumbnail back to its normal state
      thumbnailDivArray[c].style.transform = 'rotateY(180deg)'; // make the clicked thumbnail become the newly active thumbnail 
      y = x;// make the previously active thumbnail match the one that we have just set back to normal state

      c = parseInt(c); // change c value type to number
      i = c; // update the value of i to the currently active slide, ready for the next event
      x = i; // update the value of x to the currently active thumbnail, ready for the next event
    });
  };



  // Let's open the modal when the user clicks on the slide
  let modal = document.querySelector('#myModal');
  let catImage = document.querySelector('.slide');
  slideContainer.addEventListener('click', function(){
    modal.append(slideRow, thumbnailsRow);
    album.style.display = 'none';
    modal.style.display = "block";
    slideContainer.replaceChild(modalSlide, slide);
    modalSlide.style.display = 'block';
    modalSlide.style.maxHeight = '768px';
    caption.style.display = 'none';
    slideNumber.className = 'modalslidenumber col-xs-6 col-xs-offset-1'
    buttons.className = 'modalbuttons row';
    buttons.style.position = 'relative';
    nextButton.className = 'modalnext col-xs-2 col-xs-offset-1'
    nextButton.style.color = '#fff';
    previousButton.className = 'modalprevious col-xs-2'
    previousButton.style.color = '#fff';
    slideNumber.style.color = '#fff';
    magnifier.style.display = 'none';
    slideContainer.style.margin = '0 auto';           
    slideContainer.addEventListener('mouseover', function(){
      slideContainer.style.cursor = 'default';
      });
  });

  /*If swipe device has touchscreen... 
  catImage.addEventListener('touchstart', function(){
    let modal = document.querySelector('#myModal');
  let catImage = document.querySelector('.slide');
  slideContainer.addEventListener('click', function(){
    modal.append(slideRow, thumbnailsRow);
    album.style.display = 'none';
    modal.style.display = "block";
    slideContainer.replaceChild(modalSlide, slide);
    slideContainer.style.marginRight = '2em';    
    modalSlide.style.display = 'block';
    modalSlide.style.maxHeight = '768px';
    captionContainer.style.display = 'none';
    nextButton.style.color = '#fff';
    previousButton.style.color = '#fff';
    slideNumber.style.color = '#fff';
    magnifier.style.display = 'none';
    buttons.style.top = '3em';
    buttons.style.right = '25em';
    slideContainer.addEventListener('mouseover', function(){
      slideContainer.style.cursor = 'default';
      });
  });
    });*/

    /*$(".slide").on("swipeleft", previousSlide);
    $(".slide").on("swiperight", nextSlide);*/



  //Let's close the modal when the user clicks on the X button
  document.querySelector('span.close').addEventListener('click', function() {
    album.style.display = 'block';
    album.append(slideRow,thumbnailsRow);
    modal.style.display = "none";
    slideContainer.replaceChild(slide, modalSlide);
    slideContainer.style.margin = '0 2em 0 0';      
    captionContainer.style.display = 'block';
    slideNumber.className = 'slidenumber col-xs-6 col-xs-offset-1'
    buttons.style.position = 'initial';
    buttons.className = 'buttons row';
    caption.style.display = 'flex';
    nextButton.className = 'next col-xs-2 col-xs-offset-1'
    nextButton.style.color = '#000';
    previousButton.className = 'previous col-xs-2'
    previousButton.style.color = '#000';
    slideNumber.style.color = '#000';
    magnifier.style.display = 'initial';
    //buttons.style.right = '7em';    
    slideContainer.addEventListener('mouseover', function(){
      slideContainer.style.cursor = 'zoom-in';
      });

  });

  // When the user mouse over the slide let's show, using the cursor, the image can be viewed in a modal
  catImage.addEventListener('mouseover', function(){
    catImage.style.cursor = 'zoom-in';
    magnifier.style.display = 'initial';            
      });
  catImage.addEventListener('mouseout', function(){
    catImage.style.cursor = 'default';
    magnifier.style.display = 'none';            
      });

  //When the user mouse over the next/previous buttons, let's change the cursor
  nextButton.addEventListener('mouseover', function(){
    nextButton.style.cursor = 'pointer';
  });
  previousButton.addEventListener('mouseover', function(){
    previousButton.style.cursor = 'pointer';
  })

  nextButton.addEventListener('mouseout', function(){
    nextButton.style.cursor = 'default';
  });
  previousButton.addEventListener('mouseout', function(){
    previousButton.style.cursor = 'default';
  })



  //On mobile devices
  if (screen.availWidth <= 992) {
    magnifier.style.display = 'initial'; 
  };

});

