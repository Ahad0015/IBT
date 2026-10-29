import { Link } from 'react-router-dom'

// Generic button. Pass `to` to render a router link that looks the same.
export default function Button({ variant = 'primary', size, block, to, className = '', children, ...props }) {
  const classes = [
    'btn',
    variant !== 'primary' && `btn--${variant}`,
    size && `btn--${size}`,
    block && 'btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
