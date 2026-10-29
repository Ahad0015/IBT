import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Accessible modal shell: traps focus, closes on Escape or a backdrop click,
// locks page scroll, and returns focus to whatever opened it.
export default function Modal({ title, onClose, children, wide = false, labelledBy = 'modal-title' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const dialog = dialogRef.current
    const first = dialog.querySelector('[data-autofocus]') || dialog.querySelector(FOCUSABLE)
    first?.focus()
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const nodes = [...dialog.querySelectorAll(FOCUSABLE)]
      if (nodes.length === 0) return
      const firstNode = nodes[0]
      const lastNode = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault()
        lastNode.focus()
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault()
        firstNode.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className={`modal${wide ? ' modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <div className="modal__head">
          <h2 id={labelledBy}>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
