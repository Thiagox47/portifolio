const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');
const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]')];
const sections = [...document.querySelectorAll('[data-section]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroVideo = document.querySelector('[data-hero-video]');

if (heroVideo && !reduceMotion) {
  heroVideo.play().catch(() => {});
}

function setMenu(open) {
  if (!open && mobileMenu.contains(document.activeElement)) menuButton.focus();
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.inert = !open;
  mobileMenu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

mobileLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const currentId = `#${visible.target.id}`;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === currentId));
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.5] });

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const caseDialog = document.querySelector('#case-dialog');
const caseTitle = caseDialog.querySelector('#case-title');
const caseSummary = caseDialog.querySelector('#case-summary');
const caseFields = [...caseDialog.querySelectorAll('[data-case-field]')];
const closeCaseButton = caseDialog.querySelector('.case-close');

const caseStudies = {
  nexus: {
    title: 'NexusAuth',
    summary: 'Hub demonstrativo de autenticação e onboarding SaaS, documentado com foco em segurança e arquitetura modular.',
    problem: 'Fluxos de acesso precisam equilibrar segurança, clareza e baixa fricção sem deixar regras sensíveis expostas no navegador.',
    solution: 'Uma SPA demonstrativa com login, registro, Magic Link, OAuth simulado, perfis rápidos para avaliação e visualização de sessão JWT.',
    technologies: 'HTML5, CSS3, JavaScript ES6+, Node.js Assert, Docker, Nginx Alpine e shell scripting.',
    development: 'O projeto encapsula estado em uma IIFE, usa manipulação segura do DOM, sanitização de entradas, medidor de entropia e bloqueio após tentativas inválidas. Inclui testes unitários nativos e configuração de headers de segurança no Nginx.',
    result: 'Um repositório público executável e documentado que reúne interface, threat modeling, testes e infraestrutura em uma única demonstração técnica.'
  },
  assistente: {
    title: 'Assistente Virtual',
    summary: 'Primeira versão de um assistente de voz em português desenvolvido com Python.',
    problem: 'Criar uma interação simples por voz capaz de reconhecer comandos em português e responder sem depender de uma interface gráfica.',
    solution: 'Um fluxo contínuo de escuta que identifica a palavra de ativação, procura o comando em um arquivo JSON e responde por síntese de fala.',
    technologies: 'Python, SpeechRecognition, pyttsx3, Google Speech Recognition, datetime e JSON.',
    development: 'Os comandos ficam separados em JSON, permitindo respostas configuráveis. O código trata falhas de reconhecimento, consulta data e hora dinamicamente e encerra a gravação por comando de voz.',
    result: 'Uma implementação funcional de reconhecimento e síntese de voz que demonstra integração de bibliotecas, configuração externa e tratamento de erros.'
  }
};

document.querySelectorAll('.open-case').forEach((button) => {
  button.addEventListener('click', () => {
    const study = caseStudies[button.dataset.case];
    if (!study) return;
    caseTitle.textContent = study.title;
    caseSummary.textContent = study.summary;
    caseFields.forEach((field) => {
      field.textContent = study[field.dataset.caseField];
    });
    caseDialog.showModal();
  });
});

closeCaseButton.addEventListener('click', () => caseDialog.close());
caseDialog.addEventListener('click', (event) => {
  if (event.target === caseDialog) caseDialog.close();
});

const form = document.querySelector('#contact-form');
const formStatus = form.querySelector('.form-status');
const submitButton = form.querySelector('.form-submit');
const submitLabel = form.querySelector('.submit-label');

function validateField(field) {
  const wrapper = field.closest('.field');
  const valid = field.checkValidity();
  wrapper.classList.toggle('is-invalid', !valid);
  field.setAttribute('aria-invalid', String(!valid));
  return valid;
}

form.querySelectorAll('input, select, textarea').forEach((field) => {
  field.addEventListener('blur', () => {
    if (field.required || field.value) validateField(field);
  });
  field.addEventListener('input', () => {
    if (field.closest('.field').classList.contains('is-invalid')) validateField(field);
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.classList.remove('is-visible', 'is-success', 'is-error');
  const requiredFields = [...form.querySelectorAll('[required]')];
  const valid = requiredFields.map(validateField).every(Boolean);

  if (!valid) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  submitButton.classList.add('is-loading');
  submitButton.disabled = true;
  form.setAttribute('aria-busy', 'true');
  submitLabel.textContent = 'Enviando contato...';

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);

  try {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`Form submission failed with status ${response.status}`);

    form.reset();
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.setAttribute('aria-invalid', 'false'));
    form.querySelectorAll('.field.is-invalid').forEach((field) => field.classList.remove('is-invalid'));
    formStatus.textContent = 'Contato enviado com sucesso. Responderei pelo endereço informado.';
    formStatus.classList.add('is-visible', 'is-success');
  } catch (error) {
    formStatus.textContent = error.name === 'AbortError'
      ? 'O envio demorou mais que o esperado. Tente novamente ou use o endereço de e-mail ao lado.'
      : 'Não foi possível enviar agora. Tente novamente ou escreva para thiago.vss.20@gmail.com.';
    formStatus.classList.add('is-visible', 'is-error');
  } finally {
    window.clearTimeout(timeoutId);
    submitButton.classList.remove('is-loading');
    submitButton.disabled = false;
    form.removeAttribute('aria-busy');
    submitLabel.textContent = 'Enviar contato por e-mail';
  }
});

document.querySelector('#current-year').textContent = new Date().getFullYear();
