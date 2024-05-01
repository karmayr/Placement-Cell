$(document).ready(function () {
    let experienceCount = 0; // Initialize to 0
    const maxExperiences = 3;

    // Function to add a new experience
    function addExperience() {
        if (experienceCount < maxExperiences) {
            experienceCount++;
            const experienceTemplate = `
                <div class="experience">
                    <label for="company${experienceCount}">Company:</label>
                    <input type="text" name="experiences[${experienceCount}][company]" id="company${experienceCount}" class="form-control">
                    <label for="role${experienceCount}">Role:</label>
                    <input type="text" name="experiences[${experienceCount}][role]" id="role${experienceCount}" class="form-control">
                    <label for="duration${experienceCount}">Duration:</label>
                    <input type="text" name="experiences[${experienceCount}][duration]" id="duration${experienceCount}" class="form-control">
                    <button type="button" class="my-3 btn btn-danger removeExperience">Remove</button>
                </div>
            `;
            $('#experienceContainer').append(experienceTemplate);
        } else {
            alert("Maximum 3 experiences allowed.");
        }
    }

    // Function to remove an experience
    $(document).on('click', '.removeExperience', function () {
        $(this).closest('.experience').remove();
        experienceCount--;
    });

    // Event listener for "Add Experience" button
    $('#addExperience').click(addExperience);
});


$(document).ready(function () {
    let projectCount = 1; // Initialize to 0
    const maxProjects = 3;

    // Function to add a new project
    function addProject() {
        if (projectCount < maxProjects) {
            projectCount++;
            const projectTemplate = `
                <div class="form-group mb-2 project">
                    <label for="projectName">Project Name:</label>
                    <input type="text" name="projects[${projectCount - 1}][projectName]" class="form-control">
                    <label for="projectDescription">Project Description:</label>
                    <textarea name="projects[${projectCount - 1}][projectDescription]" class="form-control"></textarea>
                    <label for="projectLink">Project Link:</label>
                    <input type="url" name="projects[${projectCount - 1}][projectLink]" class="form-control">
                    <button type="button" class="mt-2 btn btn-danger removeProject">Remove</button>
                </div>
            `;
            $('#projectContainer').append(projectTemplate);
            $('.removeProject').show(); // Show remove button
        } else {
            alert("Maximum 2 projects allowed.");
        }
    }

    // Function to remove a project
    function removeProject() {
        $(this).closest('.project').remove();
        projectCount--;
    }
    // Event listener for "Add Project" button
    $('#addProject').click(function () {
        addProject();
    });

    // Event listener for dynamically added "Remove" buttons
    $(document).on('click', '.removeProject', removeProject);
});


$(document).ready(function () {
    let certificateCount = 0;
    const maxCertificates = 3;

    // Function to add a new certificate
    function addCertificate() {
        if (certificateCount < maxCertificates) {
            certificateCount++;
            const certificateTemplate = `
            <div class="certificate mb-3">
                <div class="form-groupmb-3">
                    <label for="certificationName" class="form-label">Certification Name</label>
                    <input type="text" name="certifications[${certificateCount - 1}][certificationName]" class="form-control">
                </div>
                <div class="form-group mb-2">
                    <label for="certificateImage" class="form-label">Certificate Image</label>
                    <input type="file" name="certifications[${certificateCount - 1}][images][url]" class="form-control">
                </div>
                <button type="button" class="btn btn-danger removeCertificate">Remove</button>
            </div>
        `;
            $('#certificatesContainer').append(certificateTemplate);
        } else {
            alert("Maximum 3 certificates allowed.");
        }
    }

    // Event listener for "Add Certificate" button
    $('#addCertificate').click(function () {
        addCertificate();
    });

    // Event listener for "Remove Certificate" button
    $(document).on('click', '.removeCertificate', function () {
        $(this).closest('.certificate').remove();
        certificateCount--;
    });
});



