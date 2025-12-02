declare module 'react-responsive-embed' {
  interface ResponsiveEmbedProps {
    src: string;
    ratio?: string;
    title?: string;
    allowFullScreen?: boolean;
    frameBorder?: string;
  }
  
  const ResponsiveEmbed: React.FC<ResponsiveEmbedProps>;
  export default ResponsiveEmbed;
}
