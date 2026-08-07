// Metallic-gold AMAZTRA wordmark: Cinzel 700, gradient-clipped text. The bright
// band at 44-56% of the gradient is what reads as metal. Three variants differ
// only in size, tracking, and relief shadow; the gradient itself is shared in CSS.
// `as` picks the element (span by default; the bar and footer use links/spans).
export default function Wordmark({ variant = 'hero', as = 'span', className = '', ...rest }) {
  const Tag = as;
  return (
    <Tag className={`wordmark wordmark--${variant}${className ? ' ' + className : ''}`} {...rest}>
      AMAZTRA
    </Tag>
  );
}
