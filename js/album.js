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
    var photoCol = document.getElementById(`col_${contentId.split('_')[1]}`);
    var date = photoCol.getElementsByTagName("small")[0].innerText;
    var format_date = dateFormat(date);
    document.getElementById("datePicker").value = format_date;

    document.getElementById("edit_content").value = document.getElementById(contentId).innerText;
    document.getElementById("btn_save").setAttribute('onclick', `saveContent('${contentId}')`);
    editModal.show();
}

function saveContent(contentId) {
    var photoCol = document.getElementById(`col_${contentId.split('_')[1]}`);
    photoCol.getElementsByTagName("small")[0].innerText = document.getElementById("datePicker").value.split('-').join('/');
    document.getElementById(contentId).innerText = document.getElementById("edit_content").value;
    editModal.hide();
    
    SortingPhotoCol();
}

function SortingPhotoCol() {
    var album = document.getElementById('album');
    var colElements = new Array();
    var col_new = album.getElementsByClassName('col')[album.getElementsByClassName('col').length - 1];

    for (let i = 0; i < album.getElementsByClassName('col').length - 1; i++) {
        colElements.push(album.getElementsByClassName('col')[i]);
    }

    colElements.forEach(element => {
        console.log(element.id);
    })

    colElements.sort(function (colA, colB) {
        var dateA = colA.getElementsByTagName('small')[0].innerText.split('/').join('');
        var dateB = colB.getElementsByTagName('small')[0].innerText.split('/').join('');
        return dateA - dateB;
    })

    album.innerHTML = '';
    album.appendChild(document.createTextNode('\n'));

    colElements.forEach(element => {
        album.appendChild(element);
        album.appendChild(document.createTextNode('\n'));
    })

    album.appendChild(col_new);
    album.appendChild(document.createTextNode('\n'));

    console.log(album.childNodes);
}

function deleteClicked(deleteId) {
    deleteModal.className += " d-flex align-items-center ";
    del_no.onclick = function () {
        deleteModal.className = "modal modal-sheet";
    }
    del_yes.onclick = function () {
        document.getElementById(deleteId).remove();
        deleteModal.className = "modal modal-sheet";
    }

}

document.getElementById('fileInput').addEventListener('change', function (event) {
    var file = event.target.files[0];
    var album = document.getElementById('album');
    var elementCount = album.childElementCount;

    if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
    }

    var photoCol = document.createElement('div');
    photoCol.id = `col_${elementCount}`;
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

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-info';
    deleteBtn.setAttribute('data-bs-toggle', 'modal');
    deleteBtn.setAttribute('onclick', `deleteClicked('${photoCol.id}')`);
    deleteBtn.innerText = 'Delete';

    var date = document.createElement('small');
    date.className = 'text-body-secondary';
    date.innerText = document.getElementById('newDate').innerText;

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    cardFooter.appendChild(btnGroup);
    cardFooter.appendChild(date);
    cardBody.appendChild(cardContent);
    cardBody.appendChild(cardFooter);
    photoCard.appendChild(img);
    photoCard.appendChild(cardBody);
    photoCol.appendChild(photoCard);

    album.insertBefore(photoCol, album.childNodes[album.childNodes.length - 2]);
    album.insertBefore(document.createTextNode('\n'), album.childNodes[album.childNodes.length - 2]);
});

function dateFormat(date) {
    var year = date.split('/')[0];
    var month = date.split('/')[1];

    if (month.length == 1) {
        month = '0' + month;
    }

    var day = date.split('/')[2];

    return `${year}-${month}-${day}`;
}