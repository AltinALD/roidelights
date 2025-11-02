document.addEventListener("DOMContentLoaded", () => {
  // --- MODAL SETUP ---
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <div id="modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector(".close-btn");
  const modalBody = modal.querySelector("#modal-body");

  // Close modal when clicking X or outside content
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  // --- MODAL BUTTON ACTIONS ---
  document.querySelectorAll(".chat-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const name = e.target.closest(".lawyer-card").querySelector("h2").textContent;
      modalBody.innerHTML = `
        <h2>Chat with ${name}</h2>
        <div class="chat-box">
          <p><strong>${name}:</strong> Hello! How can I help you today?</p>
          <input type="text" placeholder="Type your message..." autofocus />
          <button class="send-btn">Send</button>
        </div>
      `;
      modal.classList.add("active");
    })
  );

  document.querySelectorAll(".book-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const name = e.target.closest(".lawyer-card").querySelector("h2").textContent;
      modalBody.innerHTML = `
        <h2>Book Appointment with ${name}</h2>
        <form class="book-form">
          <label>Your Name:</label>
          <input type="text" placeholder="Enter your name" required />
          <label>Select Date:</label>
          <input type="date" required />
          <button type="submit">Confirm Booking</button>
        </form>
      `;
      modal.classList.add("active");
    })
  );

  document.querySelectorAll(".contact-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const name = e.target.closest(".lawyer-card").querySelector("h2").textContent;
      modalBody.innerHTML = `
        <h2>Contact ${name}</h2>
        <p>Email: contact@lawyerconnect.com</p>
        <p>Phone: +49 123 456 7890</p>
        <button class="close-contact">Close</button>
      `;
      modal.classList.add("active");
      modalBody.querySelector(".close-contact").addEventListener("click", () => {
        modal.classList.remove("active");
      });
    })
  );

  // --- BURGER MENU SETUP ---
  const menuIcon = document.getElementById("menu-icon");
  const menu = document.getElementById("menu");

  menuIcon.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
});
