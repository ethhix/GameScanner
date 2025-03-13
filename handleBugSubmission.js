emailjs.init("E3xmfQX6FFdg7c45a");

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  // Verify hCaptcha first
  const hCaptchaResponse = hcaptcha.getResponse();
  if (!hCaptchaResponse) {
    alert("Please complete the captcha first!");
    return;
  }

  // Get form data with correct IDs
  const formData = {
    title: document.getElementById("bug-title").value,
    briefDescription: document.getElementById("brief-description").value,
    description: document.getElementById("description").value,
    game: document.getElementById("game-input")?.value || "Not specified",
    severity: document.getElementById("severity-input").value,
    captchaResponse: hCaptchaResponse,
  };

  // Show loading state
  const submitButton = document.querySelector(".submitButton");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  // Send email using EmailJS
  emailjs
    .send("service_hvyy3un", "template_8ylojgz", {
      title: formData.title,
      briefDescription: formData.briefDescription,
      description: formData.description,
      game: formData.game,
      severity: formData.severity,
      submitDate: new Date().toLocaleString(),
    })
    .then(function (response) {
      console.log("SUCCESS!", response.status, response.text);
      alert("Bug report submitted successfully!");

      // Reset form
      document.querySelector("form").reset();
      hcaptcha.reset();

      // Reset button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    })
    .catch(function (error) {
      console.log("FAILED...", error);
      alert("Failed to submit bug report. Please try again.");

      // Reset button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    });
});
