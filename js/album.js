var editModal = new bootstrap.Modal(document.getElementById('editModal'), {
    keyboard: false
  });

function photoClicked(photoName, contentId) {
  document.getElementById("photo_show").src = "../img/photos/" + photoName;
  document.getElementById("modal_footer").innerText = document.getElementById(contentId).innerText;
  var myModal = new bootstrap.Modal(document.getElementById('photoModal'), {
    keyboard: false
  });
  myModal.show();
}

function editClicked(contentId) {      
  document.getElementById("edit_content").value = document.getElementById(contentId).innerText;
  document.getElementById("btn_save").setAttribute('onclick', `saveContent('${contentId}')`);
  editModal.show();
}

function saveContent(contentId) {
  document.getElementById(contentId).innerText = document.getElementById("edit_content").value;
  editModal.hide();
}

document.getElementById('fileInput').addEventListener('change', function(event) {
  var file = event.target.files[0];
  var album = document.getElementById('album');
  var elementCount = album.childElementCount;

  if (!file.type.match('image.*')) {
    alert('Please select an image file');
    return;
  }

  var photoCol = document.createElement('div');
  photoCol.className = 'col';

  var photoCard = document.createElement('div');
  photoCard.className = 'card shadow-sm';

  var img = document.createElement('img');
  img.className = 'card-img-top photos';
  img.src = URL.createObjectURL(file);
  img.style.objectPosition = 'center';
  img.setAttribute('data-bs-toggle', 'modal');

  var cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  var cardContent = document.createElement('p');
  cardContent.id = `content_${elementCount}`;
  cardContent.className = 'card-text text-truncate';
  cardContent.innerText = '紀錄一下～';

  img.setAttribute('onclick', `photoClicked('${file.name}', '${cardContent.id}')`);

  var cardFooter = document.createElement('div');
  cardFooter.className = 'd-flex justify-content-between align-items-center';

  var btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  var editBtn = document.createElement('button');
  editBtn.className = 'btn btn-sm btn-outline-info';
  editBtn.setAttribute('data-bs-toggle', 'modal');
  editBtn.setAttribute('onclick', `editClicked('${cardContent.id}')`);
  editBtn.innerText = 'Edit';

  var date = document.createElement('small');
  date.className = 'text-body-secondary';
  date.innerText = document.getElementById('newDate').innerText;

  btnGroup.appendChild(editBtn);
  cardFooter.appendChild(btnGroup);
  cardFooter.appendChild(date);
  cardBody.appendChild(cardContent);
  cardBody.appendChild(cardFooter);
  photoCard.appendChild(img);
  photoCard.appendChild(cardBody);
  photoCol.appendChild(photoCard);

  album.insertBefore(photoCol, album.childNodes[album.childNodes.length - 2]);
});
