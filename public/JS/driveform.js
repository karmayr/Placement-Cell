function nextStep(currentStepId) {
    var currentStep = document.getElementById(currentStepId);
    var nextStep = document.getElementById('step' + (parseInt(currentStepId.slice(-1)) + 1));

    currentStep.style.display = 'none';
    nextStep.style.display = 'block';
}

function prevStep(currentStepId) {
    var currentStep = document.getElementById(currentStepId);
    var prevStep = document.getElementById('step' + (parseInt(currentStepId.slice(-1)) - 1));

    currentStep.style.display = 'none';
    prevStep.style.display = 'block';
}







