// ── Copy to clipboard ─────────────────────────────────────────
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent
      btn.textContent = '✓ Copied!'
      btn.classList.add('copied')
      setTimeout(() => {
        btn.textContent = original
        btn.classList.remove('copied')
      }, 2000)
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      btn.textContent = '✓ Copied!'
      btn.classList.add('copied')
      setTimeout(() => {
        btn.textContent = '⎘ Copy'
        btn.classList.remove('copied')
      }, 2000)
    })
  })
})

// ── Scroll reveal ─────────────────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      io.unobserve(entry.target)
    }
  })
}, { threshold: 0.12 })

document.querySelectorAll('.reveal').forEach(el => io.observe(el))

// ── Staggered children reveal ─────────────────────────────────
document.querySelectorAll('[data-stagger]').forEach(parent => {
  const children = parent.children
  Array.from(children).forEach((child, i) => {
    child.classList.add('reveal')
    child.style.transitionDelay = `${i * 80}ms`
  })
  // observe the parent; when visible, add visible to children via the io above
  io.observe(parent)
  // Also observe each child separately
  Array.from(children).forEach(child => io.observe(child))
})

// ── Smooth scroll for nav links ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'))
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})

// ── Nav background on scroll ───────────────────────────────────
const nav = document.querySelector('nav')
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.style.borderBottomColor = 'rgba(30,32,40,.8)'
  } else {
    nav.style.borderBottomColor = ''
  }
}, { passive: true })
