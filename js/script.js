const sheetID = "1oVeeKWxTdGzAfZaOxmwF4oF4chAzZq8JQN4QKAVzTDk";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

let allJobs = [];
let visibleCount = 10; // initially show 10

$(document).ready(function () {

    $.get(url, function (data) {

        let json = JSON.parse(data.substring(47).slice(0, -2));
        let rows = json.table.rows;

        rows.forEach(row => {
             if (row.c[1]?.v?.trim() === "") {
                 return;
             }
             if (row.c[9]?.v?.trim() === "YES") {
                 return;
             }

        let job = {
                slno: row.c[0]?.v || "",
                title: row.c[1]?.v || "",
                company: row.c[2]?.v || "",
                location: row.c[3]?.v || "",
                experience: row.c[4]?.v || "",
                apply: row.c[5]?.v || "",
                postedRaw: row.c[6]?.v || "",
                sent: row.c[7]?.v || "",
                description: row.c[8]?.v || "",
                status: row.c[10]?.v || ""
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
        visibleCount += 5;
        renderJobs();
    });

});

function renderJobs() {

    $("#jobList").html("");

    let jobsToShow = allJobs.slice(0, visibleCount);

    jobsToShow.forEach(job => {

        let formattedDate = formatToDDMMYYYY(job.postedDate);
        let applyButton = more = "";

        if (job.apply.includes("@")) {
            // If it's an email
            applyButton = `<a href="mailto:${job.apply}" class="apply-btn">Apply Now</a>`;
        }else  if (job.apply.includes("https://") || job.apply.includes("http://")) {
            // If it's a URL
            applyButton = `<a href="${job.apply}" class="apply-btn" target="_blank">Apply Now</a>`;
        }else if (!isNaN(job.apply.replace(/\D/g, ""))) {

            let cleanNumber = job.apply.replace(/\D/g, ""); // remove spaces, +, -

            applyButton = `
            <a href="tel:${cleanNumber}" class="apply-btn">
            Call Now
            </a>`;

        } else {
            applyButton = `
                        <button class="apply-btn disabled-btn" disabled>
                            ${job.apply}
                        </button>`;
        }
        if(job.description && job.description.trim() !== "") {
            more = `<button class="more-btn" onclick="toggleDescription(this)">
                More
            </button>

            <div class="job-description" style="display: none;">
                <p><pre>${job.description}</pre></p>
            </div>`;
        }

        let statusClass = '';
        let statusText = job.status; // assuming you fetch status from sheet

        if (statusText === 'Latest') {
            statusClass = 'status-latest';
        } else if (statusText === 'Recent') {
            statusClass = 'status-recent';
        } else if (statusText === 'Closing Soon') {
            statusClass = 'status-closing';
        } else if (statusText === 'Final Days') {
            statusClass = 'status-final';
        }

        $("#jobList").append( `
    <div class="job-card">
        <div class="card-header">
            <div class="title-row">
                <span class="job-title">${job.title}</span>
                <span class="status-badge ${statusClass}">
                    ${statusText}
                </span>
            </div>
        </div>

        <div class="card-body">
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Experience:</strong> ${job.experience}</p>
            <p><strong>Posted:</strong> ${formattedDate}</p>
            ${more}
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

function toggleDescription(button) {

    const descriptionDiv = $(button).parent().find(".job-description");

    descriptionDiv.toggleClass("open");

    if (descriptionDiv.hasClass("open")) {
        button.innerText = "Less";
        $(descriptionDiv).css("display", "block");
    } else {
        button.innerText = "More";
        $(descriptionDiv).css("display", "none");
    }
}