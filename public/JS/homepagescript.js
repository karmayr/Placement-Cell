const sections = [
    { trigger: document.getElementById('placementcell'), links: document.getElementById('pc') },
    { trigger: document.getElementById('forstudents'), links: document.getElementById('fs') },
    { trigger: document.getElementById('forrecruiters'), links: document.getElementById('fr') }
];

// Function to show the links
function showLinks(links) {
    links.classList.remove('hidden');
}

// Function to hide the links
function hideLinks(links) {
    links.classList.add('hidden');
}

// Function to handle mouse movements
function handleMouseMovement(section) {
    const { trigger, links } = section;

    trigger.addEventListener('mouseover', () => {
        showLinks(links);
    });

    links.addEventListener('mouseover', () => {
        showLinks(links);
    });

    trigger.addEventListener('mouseout', () => {
        setTimeout(() => {
            if (!trigger.matches(':hover') && !links.matches(':hover')) {
                hideLinks(links);
            }
        }, 300); // Adjust this delay (in milliseconds) as needed
    });

    links.addEventListener('mouseout', () => {
        setTimeout(() => {
            if (!trigger.matches(':hover') && !links.matches(':hover')) {
                hideLinks(links);
            }
        }, 300); // Adjust this delay (in milliseconds) as needed
    });

    links.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent hiding the links when clicking them
    });
}

// Adding event listeners for each section
sections.forEach(section => {
    handleMouseMovement(section);
});

// GSAP  

// const image = document.getElementById('image');
// const button = document.getElementById('button');


gsap.from("#image", {
    x: 300,
    opacity: 0,
    duration: 0.5
})
gsap.from("#button", {
    x: -300,
    opacity: 0,
    duration: 1
})
