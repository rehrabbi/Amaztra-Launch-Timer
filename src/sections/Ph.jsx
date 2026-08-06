// Clearly-marked placeholder. Wraps content that is NOT a verified fact and must
// be replaced before launch. Rendered with a dashed outline and a small tag so it
// is unmistakable in the page and in screenshots.
export function Ph({ children, tag = 'placeholder' }) {
  return (
    <span className="ph" data-ph title="Placeholder: replace before launch">
      {children}
      <span className="ph__tag" aria-hidden="true">{tag}</span>
      <span className="sr-only"> (placeholder, to be confirmed)</span>
    </span>
  );
}
