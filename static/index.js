
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}


let normalized = [];



$.get('/static/data.csv', (data) => {



    let res = CSVToArray(data, ',')
    res.pop();
    let users = {};



    res.forEach((data) => {
        let time = moment(data[2], 'HH:mm:ss a').diff(moment(data[1], 'HH:mm:ss a'));

        let min = moment.duration(time).asMinutes() * 16.66;
        if (users[data[0]] == undefined) {
            users[data[0]] = {
                days: 1,
                salary: []
            }
            users[data[0]].salary.push(min);

        } else {
            users[data[0]].days++;
            users[data[0]].salary.push(min);

        }
    });



    let updateData = [];


    for (let name in users) {
        updateData.push({
            name: name,
            data: users[name]
        });
    }

    normalized = updateData.map((userData) => {

        let salary = 0;
        userData.data.salary.forEach(item => salary += item);
        userData.totalSalary = salary;

        return userData;

    })


    normalized.forEach((user) => {

        usersData.innerHTML += '<tr> <td>' + user.name + '</td>  <td>' + user.data.days + '</td>  <td>' + user.totalSalary + '</td> </tr>'
    });


});


function updateTable(array) {

    usersData.innerHTML = '';

    array.forEach((user) => {

        usersData.innerHTML += '<tr> <td>' + user.name + '</td>  <td>' + user.data.days + '</td>  <td>' + user.totalSalary + '</td> </tr>'
    });

}


function sortBySalary() {

    let dir = event.target.getAttribute('direction');

    if (dir == null || dir == "dsc") {
        event.target.setAttribute('direction', 'asc');

        normalized.sort((a, b) => {

            let Sa = +a.totalSalary;
            let Sb = +b.totalSalary



            if (Sa < Sb) {
                return -1
            } else if (Sa > Sb) {
                return 1;
            } else {

                return 0;
            }
        });


    } else {
        event.target.setAttribute('direction', 'dsc');

        normalized.sort((a, b) => {

            let Sa = +a.totalSalary;
            let Sb = +b.totalSalary



            if (Sa < Sb) {
                return 1
            } else if (Sa > Sb) {
                return -1;
            } else {

                return 0;
            }
        });


    }



    updateTable(normalized)

};



function sortByName() {

    let dir = event.target.getAttribute('direction');

    if (dir == null || dir == "dsc") {
        event.target.setAttribute('direction', 'asc');

        normalized.sort((a, b) => {

            let Sa = a.name.toLowerCase();
            let Sb = b.name.toLowerCase()

            if (Sa < Sb) {
                return -1
            } else if (Sa > Sb) {
                return 1;
            } else {

                return 0;
            }
        });


    } else {
        event.target.setAttribute('direction', 'dsc');

        normalized.sort((a, b) => {

            let Sa = a.name.toLowerCase();
            let Sb = b.name.toLowerCase();

            if (Sa < Sb) {
                return 1
            } else if (Sa > Sb) {
                return -1;
            } else {

                return 0;
            }
        });


    }
    updateTable(normalized)

}