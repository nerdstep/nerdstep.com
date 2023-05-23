export type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

export const Anchor = ({ children, href, ...props }: AnchorProps) => (
  <a {...props} href={href} rel="noopener noreferrer" target="_blank">
    {children}
  </a>
)
