import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger in 0.1s steps — matches the original landing's data-delay. */
  delay?: 0 | 1 | 2
  className?: string
  as?: ElementType
}

/**
 * Fades + lifts its children into view once, when they enter the viewport.
 * Mirrors the IntersectionObserver reveal from the original static page;
 * `prefers-reduced-motion` is handled in index.css.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay * 0.1}s` } : undefined}
    >
      {children}
    </Tag>
  )
}
