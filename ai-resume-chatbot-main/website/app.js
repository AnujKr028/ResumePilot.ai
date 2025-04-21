document.getElementById("resumeForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    document.querySelector('.loading-overlay').style.display = 'flex';

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch("http://127.0.0.1:5000/generate-resume", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Resume generation failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Inject preview content
        const previewHtml = `
            <h2>${data.name}</h2>
            <p>${data.email} | ${data.phone}</p>
            <p>${data.linkedin} | ${data.website}</p>
            <h2>Education</h2>
            <p>${data.education}</p>
            <h2>Skills</h2>
            <p>${data.skills}</p>
            <h2>Experience</h2>
            <p>${data.experience}</p>
            <h2>Strengths</h2>
            <p>${data.Strength}</p>
            <h2>Certifications</h2>
            <p>${data.Certifications}</p>
            <h2>Passions</h2>
            <p>${data.Passions}</p>
        `;
        document.getElementById("resumeContent").innerHTML = previewHtml;
        document.getElementById("downloadBtn").href = url;

        // Show preview modal
        document.getElementById("resumePreview").style.display = "flex";

    } catch (err) {
        alert("Error: " + err.message);
        console.error(err);
    } finally {
        document.querySelector('.loading-overlay').style.display = 'none';
    }
});


// Tab navigation functionality
const sectionTabs = document.querySelectorAll('.section-tab');
const formSections = document.querySelectorAll('.form-section');
const progressBar = document.querySelector('.progress');

sectionTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        // Update active tab
        sectionTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show active section
        formSections.forEach(section => section.classList.remove('active'));
        const sectionId = tab.getAttribute('data-section') + '-section';
        document.getElementById(sectionId).classList.add('active');
        
        // Update progress bar
        const progress = ((index + 1) / sectionTabs.length) * 100;
        progressBar.style.width = progress + '%';
    });
});

// Form submission functionality
document.getElementById("resumeForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    // Show loading overlay
    document.querySelector('.loading-overlay').style.display = 'flex';

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch("http://127.0.0.1:5000/generate-resume", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Resume generation failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "resume.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (err) {
        alert("Error: " + err.message);
        console.error(err);
    } finally {
        // Hide loading overlay
        document.querySelector('.loading-overlay').style.display = 'none';
    }
});



function closePreview() {
    document.getElementById("resumePreview").style.display = "none";
}


// ////above js is running
// document.getElementById("resumeForm").addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const form = e.target;

//     const data = {
//         name: form.name.value,
//         email: form.email.value,
//         phone: form.phone.value,
//         linkedin: form.linkedin.value,
//         github: form.github.value,
//         education: Array.from(document.querySelectorAll("#educationList .edu")).map(div => ({
//             degree: div.querySelector(".degree").value,
//             school: div.querySelector(".school").value,
//             year: div.querySelector(".year").value,
//             gpa: div.querySelector(".gpa").value,
//         })),
//         skills: form.skills.value.split(",").map(s => s.trim()),
//         projects: Array.from(document.querySelectorAll("#projectsList .project")).map(div => ({
//             title: div.querySelector(".title").value,
//             description: div.querySelector(".description").value,
//         })),
//         experience: Array.from(document.querySelectorAll("#experienceList .job")).map(div => ({
//             role: div.querySelector(".role").value,
//             company: div.querySelector(".company").value,
//             duration: div.querySelector(".duration").value,
//             description: div.querySelector(".description").value,
//         })),
//         strengths: Array.from(document.querySelectorAll("#strengthsList .strength")).map(input => input.value),
//     };

//     const response = await fetch("/generate_resume", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     });

//     const blob = await response.blob();
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "resume.pdf";
//     link.click();
// });

// // Add input field functions
// function addEducation() {
//     const div = document.createElement("div");
//     div.className = "edu";
//     div.innerHTML = `
//         <input type="text" placeholder="Degree" class="degree"/>
//         <input type="text" placeholder="School" class="school"/>
//         <input type="text" placeholder="Year" class="year"/>
//         <input type="text" placeholder="GPA" class="gpa"/>
//     `;
//     document.getElementById("educationList").appendChild(div);
// }

// function addProject() {
//     const div = document.createElement("div");
//     div.className = "project";
//     div.innerHTML = `
//         <input type="text" placeholder="Project Title" class="title"/>
//         <input type="text" placeholder="Description" class="description"/>
//     `;
//     document.getElementById("projectsList").appendChild(div);
// }

// function addExperience() {
//     const div = document.createElement("div");
//     div.className = "job";
//     div.innerHTML = `
//         <input type="text" placeholder="Role" class="role"/>
//         <input type="text" placeholder="Company" class="company"/>
//         <input type="text" placeholder="Duration" class="duration"/>
//         <input type="text" placeholder="Description" class="description"/>
//     `;
//     document.getElementById("experienceList").appendChild(div);
// }

// function addStrength() {
//     const input = document.createElement("input");
//     input.className = "strength";
//     input.type = "text";
//     input.placeholder = "Strength";
//     document.getElementById("strengthsList").appendChild(input);
// }






/////3