/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as per requirements
  const headerRow = ['Hero (hero7)'];

  // Always include three rows: header, background image, content
  // Background image row: empty (no image in HTML)
  const backgroundImageRow = [''];

  // Content row: extract all text content from the overview block, preserving structure
  let content = '';
  const overview = element.querySelector('.d-article-page-overview');
  if (overview) {
    // Extract h2 (title) if present
    const h2 = overview.querySelector('h2');
    if (h2 && h2.textContent.trim()) {
      content = `<h2>${h2.textContent.trim()}</h2>`;
    }
  }

  const contentRow = [content];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundImageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
