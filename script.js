// Lógica para o menu responsivo
const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("-translate-y-full");
});

function closeMenu() {
  mobileMenu.classList.add("-translate-y-full");
}

// Lógica do formulário de contato
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("form-message");
const generateBtn = document.getElementById("generate-message-btn");
const loadingSpinner = document.getElementById("loading-spinner");
const btnText = document.getElementById("btn-text");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent =
    "Mensagem enviada com sucesso! Em breve entraremos em contato.";
  formMessage.classList.remove("hidden");
  contactForm.reset();
});

generateBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const messageTextarea = document.getElementById("message");

  generateBtn.disabled = true;
  loadingSpinner.classList.remove("hidden");
  btnText.textContent = "";

  const userQuery = `Eu sou o/a ${
    name || "usuário"
  }. Preciso de um rascunho de mensagem breve e profissional para entrar em contato com uma agência de marketing digital sobre seus serviços.`;
  const systemPrompt =
    "Você é um assistente de escrita de IA que ajuda a criar rascunhos de e-mail profissionais e concisos. Apenas forneça o texto do rascunho. Não inclua saudações ou assinaturas.";

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    model: "gemini-2.5-flash-preview-05-20",
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=`;

  let retries = 0;
  const maxRetries = 3;

  async function fetchWithRetry(url, options) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retries < maxRetries) {
        retries++;
        const delay = Math.pow(2, retries) * 1000;
        console.log(
          `Falha na busca, tentando novamente em ${delay / 1000}s...`
        );
        return new Promise((resolve) =>
          setTimeout(() => resolve(fetchWithRetry(url, options)), delay)
        );
      } else {
        throw error;
      }
    }
  }

  try {
    const response = await fetchWithRetry(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (
      response.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].content &&
      response.candidates[0].content.parts &&
      response.candidates[0].content.parts.length > 0
    ) {
      messageTextarea.value = response.candidates[0].content.parts[0].text;
    } else {
      messageTextarea.value =
        "Desculpe, não foi possível gerar uma mensagem. Por favor, tente novamente.";
    }
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    messageTextarea.value =
      "Desculpe, ocorreu um erro ao gerar a mensagem. Por favor, tente novamente.";
  } finally {
    generateBtn.disabled = false;
    loadingSpinner.classList.add("hidden");
    btnText.textContent = "✨ Gerar Mensagem Sugerida";
  }
});

// Lógica de animação com IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
  const fadeInUpElements = document.querySelectorAll(".fade-in-up");
  const scaleInElements = document.querySelectorAll(".scale-in");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeInUpElements.forEach((el) => observer.observe(el));
  scaleInElements.forEach((el) => observer.observe(el));
});
