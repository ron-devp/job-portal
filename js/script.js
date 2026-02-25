const sheetID = "1oVeeKWxTdGzAfZaOxmwF4oF4chAzZq8JQN4QKAVzTDk";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

let allJobs = [];
let visibleCount = 12; // initially show 12

$(document).ready(function () {

    $.get(url, function (data) {

        let json = JSON.parse(data.substring(47).slice(0, -2));
        let rows = json.table.rows;

        rows.forEach(row => {

            let job = {
                slno: row.c[0]?.v || "",
                title: row.c[1]?.v || "",
                company: row.c[2]?.v || "",
                location: row.c[3]?.v || "",
                experience: row.c[4]?.v || "",
                apply: row.c[5]?.v || "",
                postedRaw: row.c[6]?.v || "",
                sent: row.c[7]?.v || "",
                description: row.c[8]?.v || ""
            };

            job.postedDate = convertToDate(job.postedRaw);
            allJobs.push(job);
        });

        // 🔥 Sort by latest date first
        allJobs.sort((a, b) => b.postedDate - a.postedDate);

        renderJobs();
    });

    // Load More Click
    $("#loadMore").click(function () {
        visibleCount += 4;
        renderJobs();
    });

});

function renderJobs() {

    $("#jobList").html("");

    let jobsToShow = allJobs.slice(0, visibleCount);

    jobsToShow.forEach(job => {

        let formattedDate = formatToDDMMYYYY(job.postedDate);
        let applyButton = "";

        if (job.apply.includes("@")) {
            // If it's an email
            applyButton = `<a href="mailto:${job.apply}" class="apply-btn">Apply Now</a>`;
        } else {
    applyButton = `
    <button class="apply-btn disabled-btn" disabled>
        ${job.apply}
    </button>`;
}

        $("#jobList").append( `
    <div class="job-card">
        <div class="card-header">
            ${job.title}
        </div>

        <div class="card-body">
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Experience:</strong> ${job.experience}</p>
            <p><strong>Posted:</strong> ${formattedDate}</p>
            ${applyButton}
        </div>
    </div>
`);
    });

    // Hide button if no more jobs
    if (visibleCount >= allJobs.length) {
        $("#loadMore").hide();
    } else {
        $("#loadMore").show();
    }
}

// Convert Google Date
function convertToDate(dateValue) {

    if (!dateValue) return new Date(0);

    if (!isNaN(Date.parse(dateValue))) {
        return new Date(dateValue);
    }

    if (typeof dateValue === "string" && dateValue.startsWith("Date(")) {
        let parts = dateValue.match(/\d+/g);
        return new Date(parts[0], parts[1], parts[2]);
    }

    return new Date(0);
}

function formatToDDMMYYYY(dateObj) {
    let day = String(dateObj.getDate()).padStart(2, '0');
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
}