let count = 1;

function addFlashCard() {
  const q = document.getElementById("question").value;
  const a = document.getElementById("answer").value;

  if (!q || !a) return alert("Please enter both question and answer.");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <strong>Q${count}. <span class="qa-label">Q:</span> ${q}</strong>
        <button onclick="deleteCard(this)">Delete</button>
      </div>
      <div class="card-back">
        <strong class="qa-label">A:</strong> ${a}
      </div>
    </div>
  `;

  card.addEventListener("click", function (e) {
    // Avoid flip when clicking delete
    if (e.target.tagName !== "BUTTON") {
      this.classList.toggle("flipped");
    }
  });

  document.getElementById("flashcards").appendChild(card);

  document.getElementById("question").value = "";
  document.getElementById("answer").value = "";
  count++;
}

function deleteCard(button) {
  const card = button.closest(".card");
  card.remove();
}
