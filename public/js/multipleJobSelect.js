$(document).ready(function () {
    let experienceCount = 0; // Initialize to 0
    const maxExperiences = 3;

    // Hide the "Remove" button initially
    $('.removeExperience').hide();

    // Function to add a new job experience
    function addExperience() {
        if (experienceCount < maxExperiences) {
            experienceCount++;
            const experienceTemplate = `
                <div class="row mb-3 experience">
                    <div class="col">
                        <div class="form-group">
                            <label for="company" class="form-label">Company</label>
                            <input type="text" name="experiences[${experienceCount - 1}][company]" class="form-control">
                        </div>
                        <div class="form-group mb-2">
                                        <div class="row">
                                            <div class="col-8">
                                                <label for="role" class="form-label ">Role</label>
                                                <input type="text" name="experiences[${experienceCount - 1}][company]"  class="form-control">
                                            </div>
                                            <div class="col-4">
                                                <label for="duration" class="form-label ">Duration</label>
                                                <input type="text" name="experiences[${experienceCount - 1}][company]"  class="form-control">
                                            </div>
                                        </div>
                                    </div>
                        <button type="button" class="btn btn-danger removeExperience">Remove</button>
                    </div>
                </div>
            `;
            $('#experienceContainer').append(experienceTemplate);
            $('.removeExperience').show(); // Show remove button
        } else {
            alert("Maximum 3 experiences allowed.");
        }
    }

    // Function to remove a job experience
    function removeExperience() {
        $(this).closest('.experience').remove();
        experienceCount--;
        if (experienceCount === 0) {
            $('.removeExperience').hide(); // Hide remove button if no experiences left
        }
    }

    // Event listener for "Add Experience" button
    $('#addExperience').click(function () {
        addExperience();
    });

    // Event listener for dynamically added "Remove" buttons
    $(document).on('click', '.removeExperience', removeExperience);
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



