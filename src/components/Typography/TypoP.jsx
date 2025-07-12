export default function TypoP({ children = 'lorem ipsum' }) {
  return <p className="leading-7 [&:not(:first-child)]:mt-1">{children}</p>;
}
