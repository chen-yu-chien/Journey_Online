var viewModal = new bootstrap.Modal(document.getElementById('viewModal'), {
  keyboard: false
});

var editContentId, newDate, newContent;

function contentClicked(contentId) {
  const content_date = document.getElementById(contentId).childNodes[1].innerText;
  const content_text = document.getElementById(contentId).childNodes[3].innerText;

  document.getElementById("date").innerText = content_date;
  document.getElementById("text").innerText = content_text;
  editContentId = contentId;

  viewModal.show();
}

function editClicked() {
  document.getElementById("date").setAttribute("style", "display: none");
  document.getElementById("datePicker").setAttribute("style", "display: inline");
  document.getElementById("text").setAttribute("style", "display: none");
  document.getElementById("text_edit").setAttribute("style", "display: inline; width: 100%; height: 100%; resize: none; wrap: hard;");
  document.getElementById("btn_edit").setAttribute("style", "display: none");
  document.getElementById("btn_save").setAttribute("style", "display: inline-block");
  document.getElementById("btn_cancel").setAttribute("style", "display: inline-block");

  var date = document.getElementById("date").innerText;
  var format_date = dateFormat(date);
  document.getElementById("datePicker").value = format_date;

  var content = document.getElementById("text").innerText;
  document.getElementById("text_edit").value = content;

  btn_save.setAttribute('onclick', `saveClicked()`);
  btn_cancel.setAttribute('onclick', `cancelClicked()`);
}

function cancelClicked() {
  btnDiplayChange();
}

function saveClicked() {
  btnDiplayChange();
  newDate = datePicker.value.split('-').join('/');
  date.innerText = newDate;
  document.getElementById(editContentId).childNodes[1].innerText = newDate;

  newContent = text_edit.value;
  text.innerText = newContent;
  document.getElementById(editContentId).childNodes[3].innerText = newContent;
}

function btnDiplayChange() {
  document.getElementById("date").setAttribute("style", "display: inline");
  document.getElementById("datePicker").setAttribute("style", "display: none");

  document.getElementById("text").setAttribute("style", "display: inline");
  document.getElementById("text_edit").setAttribute("style", "display: none");

  document.getElementById("btn_edit").setAttribute("style", "display: inline-block");
  document.getElementById("btn_save").setAttribute("style", "display: none");
  document.getElementById("btn_cancel").setAttribute("style", "display: none");
}

function dateFormat(date) {
  var year = date.split('/')[0];
  var month = date.split('/')[1];
  var day = date.split('/')[2];

  return `${year}-${month}-${day}`;
}