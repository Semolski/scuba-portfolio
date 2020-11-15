const button = document.getElementsByClassName('button_1')[0];

if ( button ) {
    button.onclick = function (e) {
        e.preventDefault();
        alert('You are now subscribed to the newsletter!')
    };
}

// When the user clicks on the button, open the modal and execute the closeModal function
document.querySelectorAll('.contact-link').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault(); // Prevents web browser from treating as hyperlink

        // Get the modal
        const modal = document.getElementsByClassName("modal")[0];

        if (modal) { // If the modal already exists on the page, do this
            modal.style.display = "block"; // Otherwise it will be "none" and non-visible
            closeModal(); // Execute the closeModal function
        } else {
            const contactDiv = document.createElement('div');   // Create a <div> element
            contactDiv.classList.add('modal');  // Add a class called "modal" to the created <div> element
            contactDiv.style.display = "block"; // Set the CSS parameter display: block; to the created <div> element
            contactDiv.innerHTML = `
        <div class="modal-content">
        <span class="close-modal">&times;</span>
        <span class="contact-form-title">contact us</span>
        
        <form name="contactForm" action="mailto:youremail@youremail.com" onsubmit="submitForm()" class="contact-form">
            <div class="modal-content-input" data-validate="Name is required">
                <input class="contact-input-name" value="" name="name" required>
                <span class="input-title">name</span>
            </div>
            <div class="modal-content-input" data-validate="Email is required">
                <span class="input-title">email</span>
                <input class="contact-input-email" value="" name="email" required>
            </div>
            <div class="modal-content-input">
                <span class="input-title">we would love to hear from you.</span>
                <textarea class="contact-message" placeholder="Enter your message..."></textarea>
            </div>
            <div class="modal-content-submit">
                <input class="submit-btn" type="submit">
            </div>
        </form>
        </div>
    `; // Define the HTML that you can append or insert into a specific element
            document.body.appendChild(contactDiv);  // Append <div class="modal"> to <body>
            closeModal(); // Execute the closeModal function
        }
    })
});

var submitForm = function () {
    const form = document.forms["contactForm"],
        inputName = document.forms["contactForm"]["name"],
        emailName = document.forms["contactForm"]["email"],
        nameValue = inputName.value,
        emailValue = emailName.value;
    if (nameValue == "") {
        inputName.style.border = "1px solid red";
        return false;
    } else {
        inputName.style.border = "none";
    }
    if (emailValue == "") {
        emailName.style.border = "1px solid red";
        return false;
    } else {
        inputName.style.border = "none";
    }

    form.innerHTML = `
    <div class="modal-content-submit">
        <h3>Thank you for contacting us! We will get back to you shortly.</h3>
    </div>
    `;
    return true;
};

// The closeModal function
var closeModal = function () {
    const modal = document.getElementsByClassName('modal')[0];
    span = document.getElementsByClassName('close-modal')[0]; // Get the <span> element that closes the modal
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.parentNode.removeChild(modal);
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.parentNode.removeChild(modal);
        }
    };
};
