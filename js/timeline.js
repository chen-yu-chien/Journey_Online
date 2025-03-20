var viewModal = new bootstrap.Modal(document.getElementById('viewModal'), {
    keyboard: false
});

var editContentId, newDate, newContent;
var monthDict = {
    "January": '01', "February": '02', "March": '03', "April": '04', "May": '05', "June": '06', "July": '07',
    "August": '08', "September": '09', "October": '10', "November": '11', "December": '12'
};
var ymList = []; // 數字型態的年月資料

function contentClicked(contentId) {
    btnDiplayChange('show');
    btn_edit.setAttribute('onclick', 'editClicked()');
    btn_delete.setAttribute('onclick', `deleteClicked()`);

    const content_date = document.getElementById(contentId).childNodes[1].innerText;
    const content_text = document.getElementById(contentId).childNodes[3].innerText;

    document.getElementById("date").innerText = content_date;
    document.getElementById("text").innerText = content_text;
    editContentId = contentId;

    viewModal.show();
}

function editClicked() {
    btnDiplayChange('edit');

    var date = document.getElementById("date").innerText;
    var format_date = dateFormat(date);
    document.getElementById("datePicker").value = format_date;

    var content = document.getElementById("text").innerText;
    document.getElementById("text_edit").value = content;

    btn_save.setAttribute('onclick', `saveClicked()`);
    btn_cancel.setAttribute('onclick', `cancelClicked()`);
}

function deleteClicked() {
    var parent = document.getElementById(editContentId).parentElement
    var grand = parent.parentElement
    var del_year = parent.getElementsByTagName('h2')[0].innerText.split(' ')[0];
    var del_month = monthDict[parent.getElementsByTagName('h2')[0].innerText.split(' ')[1]];
    var deleteYM = del_year + del_month;

    deleteModal.className += " d-flex align-items-center ";
    del_no.onclick = function () {
        deleteModal.className = "modal modal-sheet";
    }
    del_yes.onclick = function () {
        document.getElementById(editContentId).remove();
        deleteModal.className = "modal modal-sheet";
        viewModal.hide();

        if (parent.getElementsByTagName('p').length <= 0) {
            grand.remove();
            console.log(deleteYM)
            var index = ymList.indexOf(deleteYM);
            ymList.splice(index, 1);
            console.log(ymList)
        }
    }
}

function cancelClicked() {
    btnDiplayChange('cancel');
}

function saveClicked() {
    // btnDiplayChange('save');
    newDate = datePicker.value.split('-').join('/');
    date.innerText = newDate;
    document.getElementById(editContentId).childNodes[1].innerText = newDate;

    newContent = text_edit.value;
    text.innerText = newContent;
    document.getElementById(editContentId).childNodes[3].innerText = newContent;

    if (datePicker.value == '') {
        alert('請選擇日期!');
        return;
    }
    else {
        var ym = formatYM(newDate);
        var index = ymList.indexOf(ym);

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

            newIndex = ymList.indexOf(newYM);
            createContainer(newDate, newContent, newIndex);

            const count = document.getElementById(editContentId).parentElement.getElementsByTagName('p').length;
            document.getElementById(editContentId).remove();
            var newParagraph = document.getElementById(`content_${count}`);
            newParagraph.id = editContentId;
        }
        else if (ym && index >= 0) {
            console.log('yes');
            SortingParagraph()    
        }
        else {
            alert('請選擇日期!');
        }

        btnDiplayChange('save');
    }
}

function SortingParagraph() {
    var content = document.getElementById(`${editContentId}`).parentElement;
    var pElements = Array.from(content.getElementsByTagName('p'));
    var h2Element = content.getElementsByTagName('h2')[0];
    
    pElements.forEach(element => {
        console.log(element.id);
    })

    pElements.sort(function (pA, pB) {
        var dateA = pA.getElementsByClassName('text-secondary')[0].innerText.split('/').join('');
        var dateB = pB.getElementsByClassName('text-secondary')[0].innerText.split('/').join('');
        return dateA - dateB;
    })

    content.innerHTML = '';
    content.appendChild(document.createTextNode('\n'));
    content.appendChild(h2Element);
    content.appendChild(document.createTextNode('\n'));
    
    pElements.forEach(element => {
        content.appendChild(element);
        content.appendChild(document.createTextNode('\n'));
    })

    console.log(content.childNodes);
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
    btnDiplayChange('new');
    var createDate = new Date().toLocaleDateString();
    var format_createDate = dateFormat(createDate);
    document.getElementById("datePicker").value = format_createDate;
    
    text_edit.value = '';
    
    btn_cancel.setAttribute('onclick', 'newCancelClicked()');
    btn_save.setAttribute('onclick', 'newSaveClicked()');

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

    var container = document.createElement('div');
    container.setAttribute('class', 'container');

    var content = document.createElement('div');
    content.setAttribute('class', 'content');

    var subtitle = document.createElement('h2');
    subtitle.setAttribute('class', 'subtitle');
    subtitle.innerText = newDate.split('/')[0] + " " + getKeyByValue(monthDict, newDate.split('/')[1]);

    var p = createParagraph(newDate, newContent);

    content.appendChild(document.createTextNode('\n'));
    content.appendChild(subtitle);
    content.appendChild(document.createTextNode('\n'));
    content.appendChild(p);
    content.appendChild(document.createTextNode('\n'));

    container.appendChild(content);

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
    var contentBlock = document.getElementsByClassName('content')[index];
    var p = createParagraph(newDate, newContent);

    for (let i = 0; i < contentBlock.getElementsByClassName('text-secondary').length; i++) {
        var oldDate = contentBlock.getElementsByClassName('text-secondary')[i].innerText;
        var insertIndex = 2 * i + 3;

        if (i == contentBlock.getElementsByClassName('text-secondary').length - 1) {
            if (newDate > oldDate) {
                contentBlock.appendChild(p);
                contentBlock.appendChild(document.createTextNode('\n'));
            }
            else {
                contentBlock.insertBefore(p, contentBlock.childNodes[insertIndex]);
                contentBlock.insertBefore(document.createTextNode('\n'), contentBlock.childNodes[insertIndex + 1]);
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
                break;
            }
        }

    }

}

function createParagraph(newDate, newContent) {
    var content_count = document.getElementsByClassName('content-day').length;

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

    return p;
}

function btnDiplayChange(trigger) {
    switch (trigger) {
        case 'show':
            date.setAttribute('style', 'display: inline');
            datePicker.setAttribute('style', 'display: none');

            text.setAttribute('style', 'display: inline');
            text_edit.setAttribute('style', 'display: none;');

            btn_cancel.setAttribute('style', 'display: none');
            btn_save.setAttribute('style', 'display: none');
            btn_edit.setAttribute('style', 'display: inline');
            btn_delete.setAttribute('style', 'display: inline');
            console.log('show');
            break;

        case 'new':
        case 'edit':
            date.setAttribute("style", "display: none");
            datePicker.setAttribute("style", "display: inline");
            text.setAttribute("style", "display: none");
            text_edit.setAttribute("style", "display: inline; width: 100%; height: 100%; resize: none; wrap: hard;");
            btn_edit.setAttribute("style", "display: none");
            btn_delete.setAttribute("style", "display: none");
            btn_save.setAttribute("style", "display: inline-block");
            btn_cancel.setAttribute("style", "display: inline-block");

            console.log('edit');
            break;

        case 'save':
        case 'cancel':
            date.setAttribute("style", "display: inline");
            datePicker.setAttribute("style", "display: none");
            text.setAttribute("style", "display: inline");
            text_edit.setAttribute("style", "display: none");
            btn_edit.setAttribute("style", "display: inline-block");
            btn_save.setAttribute("style", "display: none");
            btn_cancel.setAttribute("style", "display: none");
            break;

        default:
            alert('無效按鍵')
            break;
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