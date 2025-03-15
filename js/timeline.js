var viewModal = new bootstrap.Modal(document.getElementById('viewModal'), {
    keyboard: false
});

// var createModal = new bootstrap.Modal(document.getElementById('createModal'), {
//   keyboard: false
// });

var editContentId, newDate, newContent;
var monthDict = {
    "January": '01', "February": '02', "March": '03', "April": '04', "May": '05', "June": '06', "July": '07',
    "August": '08', "September": '09', "October": '10', "November": '11', "December": '12'
};
var ymList = []; // 數字型態的年月資料

function contentClicked(contentId) {
    date.setAttribute('style', 'display: inline');
    datePicker.setAttribute('style', 'display: none');

    text.setAttribute('style', 'display: inline');
    text_edit.setAttribute('style', 'display: none;');

    btn_cancel.setAttribute('style', 'display: none');
    btn_save.setAttribute('style', 'display: none');
    btn_edit.setAttribute('style', 'display: inline');
    btn_edit.setAttribute('onclick', 'editClicked()');


    // console.log(document.getElementById(contentId).childNodes)
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

function newClicked() {
    date.setAttribute('style', 'display: none');
    datePicker.setAttribute('style', 'display: inline');
    var createDate = new Date().toLocaleDateString();
    var format_createDate = dateFormat(createDate);
    document.getElementById("datePicker").value = format_createDate;

    text.setAttribute('style', 'display: none');
    text_edit.setAttribute('style', 'display: inline; width: 100%; height: 100%; resize: none; wrap: hard;');
    text_edit.value = '';
    btn_cancel.setAttribute('onclick', 'newCancelClicked()');
    btn_cancel.setAttribute('style', 'display: inline');
    btn_save.setAttribute('onclick', 'newSaveClicked()');
    btn_save.setAttribute('style', 'display: inline');
    btn_edit.setAttribute('style', 'display: none');

    viewModal.show();
}

function newCancelClicked() {
    viewModal.hide();
}

function newSaveClicked() {
    if (datePicker.value == '') {
        alert('請選擇日期!');
        return;
    }
    else {
        newDate = datePicker.value.split('-').join('/');
        newContent = text_edit.value;
        // console.log(newDate, newContent);
        var ym = formatYM(newDate);
        console.log('ym ' + ym);
        console.log(ymList);

        var index = ymList.indexOf(ym);
        console.log('index ' + index);

        if (ym && index < 0) {
            var newYM = formatYM(newDate);
            var newIndex;
            for (let i = 0; i < ymList.length; i++) {
                if (newYM < ymList[i]) {
                    ymList.splice(i, 0, newYM);
                    break;
                }
            }

            if (ymList.indexOf(newYM) < 0) {
                ymList.push(newYM);
            }

            console.log('new ymlist: ', ymList);

            newIndex = ymList.indexOf(newYM);
            createContainer(newDate, newContent, newIndex);
        }
        else if (ym && index >= 0) {
            console.log('yes');
            createContent(newDate, newContent, index);
        }
        else {
            alert('請選擇日期!');
        }

        viewModal.hide();
    }
}

function createContainer(newDate, newContent, newIndex) {
    var timeline = document.getElementById('timeline');
    var content_count = document.getElementsByClassName('content-day').length;

    console.log('content_count:', content_count);

    var container = document.createElement('div');
    container.setAttribute('class', 'container');

    var content = document.createElement('div');
    content.setAttribute('class', 'content');

    var subtitle = document.createElement('h2');
    subtitle.setAttribute('class', 'subtitle');
    subtitle.innerText = newDate.split('/')[0] + " " + getKeyByValue(monthDict, newDate.split('/')[1]);

    var p = document.createElement('p');
    p.setAttribute('id', `content_${content_count + 1}`);
    p.setAttribute('class', 'border-bottom text-truncate content-day');
    p.setAttribute('data-bs-toggle', 'modal');
    p.setAttribute('onclick', `contentClicked("${p.id}")`);

    var span1 = document.createElement('span');
    span1.setAttribute('class', 'text-secondary');
    span1.innerText = newDate;

    var span2 = document.createElement('span');
    span2.innerText = ' ' + newContent;

    p.appendChild(document.createTextNode('\n'));
    p.appendChild(span1);
    p.appendChild(document.createTextNode('\n'));
    p.appendChild(span2);

    content.appendChild(document.createTextNode('\n'));
    content.appendChild(subtitle);
    content.appendChild(document.createTextNode('\n'));
    content.appendChild(p);
    content.appendChild(document.createTextNode('\n'));

    container.appendChild(content);

    // console.log('p: ', p);
    // console.log('container: ', container);

    if (newIndex < timeline.childNodes.length) {
        console.log('new index: ', newIndex);
        timeline.insertBefore(container, timeline.childNodes[2 * newIndex + 1]);
    }
    else {
        console.log('new index: ', newIndex);
        timeline.appendChild(container);
    }
}

function createContent(newDate, newContent, index) {
    var content_count = document.getElementsByClassName('content-day').length;

    var contentBlock = document.getElementsByClassName('content')[index];

    var p = document.createElement('p');
    p.setAttribute('id', `content_${content_count + 1}`);
    p.setAttribute('class', 'border-bottom text-truncate content-day');
    p.setAttribute('data-bs-toggle', 'modal');
    p.setAttribute('onclick', `contentClicked("${p.id}")`);

    var span1 = document.createElement('span');
    span1.setAttribute('class', 'text-secondary');
    span1.innerText = newDate;

    var span2 = document.createElement('span');
    span2.innerText = ' ' + newContent;

    p.appendChild(document.createTextNode('\n'));
    p.appendChild(span1);
    p.appendChild(document.createTextNode('\n'));
    p.appendChild(span2);

    console.log(contentBlock.childNodes);

    for (let i = 0; i < contentBlock.getElementsByClassName('text-secondary').length; i++) {
        var oldDate = contentBlock.getElementsByClassName('text-secondary')[i].innerText;
        console.log('oldDate: ', oldDate);
        var insertIndex = 2 * i + 3;

        if (i == contentBlock.getElementsByClassName('text-secondary').length - 1) {
            if (newDate > oldDate) {
                contentBlock.appendChild(p);
                contentBlock.appendChild(document.createTextNode('\n'));
            }
            else {
                contentBlock.insertBefore(p, contentBlock.childNodes[insertIndex]);
                contentBlock.insertBefore(document.createTextNode('\n'), contentBlock.childNodes[insertIndex + 1]);
                console.log('1. insert before ' + i);
            }
            break;
        }
        else {
            if (newDate > oldDate) {
                continue;
            }
            else {
                contentBlock.insertBefore(p, contentBlock.childNodes[insertIndex]);
                contentBlock.insertBefore(document.createTextNode('\n'), contentBlock.childNodes[insertIndex + 1]);
                console.log('2. insert before ' + i);
                break;
            }
        }

    }

}

function dateFormat(date) {
    var year = date.split('/')[0];
    var month = date.split('/')[1];

    if (month.length == 1) {
        month = '0' + month;
    }

    var day = date.split('/')[2];

    return `${year}-${month}-${day}`;
}

function formatYM(inputDate) {
    var year = inputDate.split('/')[0];
    var month = inputDate.split('/')[1];
    return year + month;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}