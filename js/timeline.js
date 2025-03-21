var viewModal = new bootstrap.Modal(document.getElementById('viewModal'), {
    keyboard: false
});

var newDate, newContent;
var monthDict = {
    "January": '01', "February": '02', "March": '03', "April": '04', "May": '05', "June": '06', "July": '07',
    "August": '08', "September": '09', "October": '10', "November": '11', "December": '12'
};
var ymList = []; // 數字型態的年月資料

function contentClicked(contentId) {
    btnDiplayChange('show');
    btn_edit.setAttribute('onclick', `editClicked('${contentId}')`);
    btn_delete.setAttribute('onclick', `deleteClicked('${contentId}')`);

    var content = document.getElementById(contentId);
    console.log(contentId);
    const content_date = content.getElementsByTagName('span')[0].innerText;
    const content_text = content.getElementsByTagName('span')[1].innerText

    date.innerText = content_date;
    text.innerText = content_text;

    viewModal.show();
}

function editClicked(contentId) {
    btnDiplayChange('edit');

    var targetDate = date.innerText;
    var format_date = dateFormat(targetDate);
    datePicker.value = format_date;

    var content = text.innerText;
    text_edit.value = content;

    // btn_save.setAttribute('onclick', `saveClicked('${contentId}')`);
    btn_save.setAttribute('onclick', `saveClicked('${contentId}', 'edit')`);
    btn_cancel.setAttribute('onclick', `cancelClicked()`);
}

function deleteClicked(contentId) {
    var parentDiv = document.getElementById(contentId).parentElement
    var grandDiv = parentDiv.parentElement
    var deleteYM = grandDiv.id.split('_')[1];

    deleteModal.className += " d-flex align-items-center ";
    del_no.onclick = function () {
        deleteModal.className = "modal modal-sheet";
    }
    del_yes.onclick = function () {
        document.getElementById(contentId).remove();
        deleteModal.className = "modal modal-sheet";
        viewModal.hide();

        if (parentDiv.getElementsByTagName('p').length <= 0) {
            grandDiv.remove();
            var index = ymList.indexOf(deleteYM);
            ymList.splice(index, 1);
        }
    }
}

function cancelClicked() {
    btnDiplayChange('cancel');
}


function saveClicked(contentId, trigger) { // trigger: 'new' or 'edit'
    if (datePicker.value == '') {
        alert('請選擇日期!');
        return;
    }
    else {
        newDate = datePicker.value.split('-').join('/');
        newContent = text_edit.value;

        if (trigger === 'edit') {
            var content = document.getElementById(contentId);
            date.innerText = newDate;
            content.getElementsByTagName('span')[0].innerText = newDate;
        
            text.innerText = newContent;
            content.getElementsByTagName('span')[1].innerText = newContent;
        }

        var newYM = formatYM(newDate);
        var index = ymList.indexOf(newYM);

        if (newYM && index < 0) {
            for (let i = 0; i < ymList.length; i++) {
                if (newYM < ymList[i]) {
                    ymList.splice(i, 0, newYM);
                    break;
                }
            }

            if (ymList.indexOf(newYM) < 0) {
                ymList.push(newYM);
            }

            var newIndex = ymList.indexOf(newYM);
            createContainer(newDate, newContent, newIndex);

            if (trigger === 'edit') {
                const origin_grand = document.getElementById(contentId).parentElement.parentElement;
                const timeline = document.getElementById('timeline');
                const pCount = timeline.getElementsByTagName('p').length;
                document.getElementById(contentId).remove();
                var newParagraph = document.getElementById(`content_${pCount}`);
                newParagraph.id = contentId;
                newParagraph.setAttribute('onclick', `contentClicked("${contentId}")`);
                
                if (origin_grand.getElementsByTagName('p').length < 1) {
                    origin_grand.remove();
                }
            }
        }
        else if (newYM && index >= 0) {
            console.log('yes');
            if (trigger === 'new') {
                contentId = createContent(newDate, newContent, index); // createContent() returns id for new <p>
            }

            SortingParagraph(contentId);    

        }
        else {
            alert('請選擇日期!');
        }

        if (trigger === 'edit') {
            btnDiplayChange('save');
        }
        else {
            viewModal.hide();
        }
    }
}

function SortingParagraph(contentId) {
    var parentContent = document.getElementById(contentId).parentElement;
    var pElements = Array.from(parentContent.getElementsByTagName('p'));
    var h2Element = parentContent.getElementsByTagName('h2')[0];
    
    pElements.forEach(element => {
        console.log(element.id);
    })

    pElements.sort(function (pA, pB) {
        var dateA = pA.getElementsByTagName('span')[0].innerText.split('/').join('');
        var dateB = pB.getElementsByTagName('span')[0].innerText.split('/').join('');
        return dateA - dateB;
    })

    parentContent.innerHTML = '';
    parentContent.appendChild(document.createTextNode('\n'));
    parentContent.appendChild(h2Element);
    parentContent.appendChild(document.createTextNode('\n'));
    
    pElements.forEach(element => {
        parentContent.appendChild(element);
        parentContent.appendChild(document.createTextNode('\n'));
    })

    console.log(parentContent.childNodes);
}

function newClicked() {
    btnDiplayChange('new');
    var createDate = new Date().toLocaleDateString();
    var format_createDate = dateFormat(createDate);
    datePicker.value = format_createDate;
    
    text_edit.value = '';
    
    btn_cancel.setAttribute('onclick', 'newCancelClicked()');
    btn_save.setAttribute('onclick', `saveClicked('', 'new')`);


    viewModal.show();
}

function newCancelClicked() {
    viewModal.hide();
}

function createContainer(newDate, newContent, newIndex) {
    var timeline = document.getElementById('timeline');

    var container = document.createElement('div');
    container.id = `c_${newDate.split('/')[0] + '' + newDate.split('/')[1]}`;
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

    insertMonthMenu(newDate, newIndex);
}

function insertMonthMenu(newDate, newIndex) {
    var ul = document.getElementById('monthMenu').getElementsByTagName('ul')[0];
    var new_li = document.createElement('li');
    var new_a = document.createElement('a');
    new_a.setAttribute('class', 'dropdown-item rounded-2');
    new_a.setAttribute('href', `#c_${newDate.split('/')[0] + '' + newDate.split('/')[1]}`);
    new_a.innerText = newDate.split('/')[0] + '/' + newDate.split('/')[1];
    new_li.appendChild(new_a);

    ul.insertBefore(new_li, ul.childNodes[2 * newIndex + 5])
    ul.insertBefore(document.createTextNode('\n'), ul.childNodes[2 * newIndex + 6]);
    console.log(ul.childNodes);
}

function createContent(newDate, newContent, index) {
    var contentBlock = document.getElementsByClassName('content')[index];
    var p = createParagraph(newDate, newContent);

    contentBlock.appendChild(p);
    contentBlock.appendChild(document.createTextNode('\n'));

    return p.id;

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