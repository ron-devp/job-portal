const sheetID = "1oVeeKWxTdGzAfZaOxmwF4oF4chAzZq8JQN4QKAVzTDk";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

$(document).ready(function () {

    $.get(url, function (data) {

        let json = JSON.parse(data.substring(47).slice(0, -2));
        let rows = json.table.rows;

        rows.forEach(row => {

            let slno = row.c[0]?.v || "";
            let title = row.c[1]?.v || "";
            let company = row.c[2]?.v || "";
            let location = row.c[3]?.v || "";
            let experience = row.c[4]?.v || "";
            let apply = row.c[5]?.v || "";
            let posted = row.c[6]?.v || "";
            let sent = row.c[7]?.v || "";
            let description = row.c[8]?.v || "";

            $("#jobList").append(`
              <div class="job-card">
                <div class="job-title">${title}</div>
                <div class="job-info"><b>SL No:</b> ${slno}</div>
                <div class="job-info"><b>Company:</b> ${company}</div>
                <div class="job-info"><b>Location:</b> ${location}</div>
                <div class="job-info"><b>Experience:</b> ${experience}</div>
                <div class="job-info"><b>Posted:</b> ${posted}</div>
                <div class="job-info"><b>Status:</b> ${sent}</div>
                <div class="job-info"><b>Description:</b> ${description}</div>
                <a class="apply-btn" href="${apply}" target="_blank">Apply Now</a>
              </div>
            `);
        });
    });

});