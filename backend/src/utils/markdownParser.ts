import MarkdownIt from 'markdown-it';


// Create and configure the parser
const md = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true, // Automatically turn URLs into links
  typographer: true,
})

md.enable(['heading', 'emphasis', 'list', 'link']);

export const parseMarkdownToHtml = (markdown: string): string => {
  return md.render(markdown);
  
};