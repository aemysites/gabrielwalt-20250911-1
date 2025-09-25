/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text content from a card column
  function extractCardContent(col) {
    // Find the image (mandatory)
    const picture = col.querySelector('picture');
    let image = null;
    if (picture) {
      image = picture;
    }

    // Find the text content block
    const textBlock = col.querySelector('.d-html-content-block');
    let textContent = [];
    if (textBlock) {
      // Get the heading (optional)
      const heading = textBlock.querySelector('h3');
      if (heading) textContent.push(heading);
      // Get the description (optional)
      const desc = textBlock.querySelector('.teaser__copy');
      if (desc) textContent.push(desc);
    }
    return [image, textContent];
  }

  // Get all immediate child columns (should be 3 for this block)
  const columns = Array.from(element.children);
  const rows = [];
  // Header row
  rows.push(['Cards (cards10)']);
  // For each column, extract card content
  columns.forEach((col) => {
    const [image, textContent] = extractCardContent(col);
    if (image && textContent.length) {
      rows.push([image, textContent]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
