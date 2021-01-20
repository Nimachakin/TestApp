    // обработчик кнопки добавления нового сервера.
    $('#addServerBtn').on('click', function() {
        var self = $(this);

        $.post('Home/AddNewServer', function(data) {
            var createDateTimeFormatted = data.createDateTime
                .split('.')[0]
                .split('T').join(' ');

            // добавляем в таблицу новую запись нового сервера
            $('table tr:last').after(
                `<tr data-id="${data.virtualServerId}">` + 
                `<td>${data.virtualServerId}</td>` +
                `<td>${createDateTimeFormatted}</td>` + 
                `<td class="removeDateField"></td>` + 
                `<td><input type="checkbox" class="form-control" />` + 
                `</tr>`
            );
        });
    });
    
    // обработчик кнопки удаления серверов, помеченных на удаление.
    $('#removeServerBtn').on('click', function() {
        var serverIds = [];
        var removeDateTime = $('#currentDateTime').text();

        // выделенные чекбоксы
        var checkedElems = $('input[type="checkbox"]').filter(function() {
            return $(this).prop('checked');
        });
        // элементы <tr> таблицы (серверы) с выделенными чекбоксами
        var items = $('tr').filter(function() { 
            return $(this).find(checkedElems).length > 0; 
        });

        items.each(function() {
            serverIds.push($(this).data('id'));
        });

        if(serverIds.length > 0) {
            $.ajax({
                url: 'Home/RemoveServers', 
                type: 'post', 
                data: { serverIds : serverIds, 
                        removeDateTime: removeDateTime }, 
                datatype: 'json'
            // }).then(function(removeDateTime) {
            }).then(function() {
                // var removeDateTimeFormatted = removeDateTime
                //     .split('.')[0]
                //     .split('T').join(' ');
                
                items.each(function() {
                    // $(this).find('.removeDateField').text(removeDateTimeFormatted);
                    $(this).find('.removeDateField').text(removeDateTime);
                    $(this).find('input').replaceWith('');
                });
            }).fail(function() {
                console.log('Что-то пошло не так!');
            });
        }
    });  

    setCurrentDateTime();
    setTotalUsageTime();

    // вывод на экран отформатированного текущего времени
    function setCurrentDateTime() {
        var dateStr = getDateString(new Date());
        var timeStr = getTimeString(new Date());

        var currentDateTime = [dateStr, timeStr].join(' ');
        $('#currentDateTime').text(currentDateTime);

        // обновляем время каждую секунду
        setTimeout(function() { 
            setCurrentDateTime()
        }, 1000);
    }

    // строковый формат даты
    function getDateString(date) {
        var year = date.getFullYear(), 
            month = date.getMonth() + 1, 
            day = date.getDate();

        return [year, month, day].join('-');
    }

    // строковый формат времени
    function getTimeString(date) {
        var hours = date.getHours(), 
            minutes = date.getMinutes(), 
            seconds = date.getSeconds();
        
        minutes = checkTime(minutes);
        seconds = checkTime(seconds);

        return [hours, minutes, seconds].join(':');
    }

    // вывод на экран отформатированного времени 
    // существования активного виртуального сервера
    function setTotalUsageTime() {
        // невыделенные чекбоксы
        var uncheckedElems = $('input[type="checkbox"]').filter(function() {
            return !$(this).prop('checked');
        }); 
        var timeString = $('#totalUsageTime').text();

        // если хотя бы один сервер не помечен на удаление - 
        // увеличиваем время действия
        if(uncheckedElems.length > 0) {
            timeString = setTimeParts(timeString);
        }

        setTimeout(function() {
                setTotalUsageTime();
        }, 1000);

        $('#totalUsageTime').text(timeString);
    }

    // увеличивает время, указанного в параметре timeString на одну секунду
    function setTimeParts(timeString) {
        var timeParts = timeString.split(':');
        var hours = +timeParts[0], 
            minutes = +timeParts[1], 
            seconds = +timeParts[2]; 
        
        seconds += 1;
        
        if(seconds == 60) {
            seconds = 0;
            minutes += 1;
        }

        if(minutes == 60) {
            minutes = 0;
            hours += 1;
        }

        if(hours == 24) {
            timeString = '00:00:00';
        }

        timeString = [
            checkTime(hours), 
            checkTime(minutes), 
            checkTime(seconds) 
        ].join(':');

        return timeString;
    }

    // добавляет '0' перед числом num, если оно меньше 10
    function checkTime(num) {
        if(num < 10) {
            return '0' + num;
        }

        return num;
    }