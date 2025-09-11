/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Hero (hero7)'];

  // Row 2: Background image (optional)
  let imageCell = '';
  // There is no image in the provided HTML, so leave cell empty
  const imageRow = [imageCell];

  // Row 3: Title, subheading, CTA (all optional)
  let contentCell = '';
  // Try to find heading, subheading, CTA in the overview block
  const overview = element.querySelector('.d-article-page-overview');
  if (overview) {
    // Only extract text content from h2 if present and non-empty
    const h2 = overview.querySelector('h2');
    if (h2 && h2.textContent.trim()) {
      contentCell = h2.textContent.trim();
    }
  }
  const contentRow = [contentCell];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
