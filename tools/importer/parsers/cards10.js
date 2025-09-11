/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text from a card column
  function extractCardContent(col) {
    // Find image: look for <picture> or <img>
    const imgContainer = col.querySelector('.d-responsive-picture, picture, img');
    let imageEl = null;
    if (imgContainer) {
      // If it's a picture, use it; else, if it's an img, use it
      imageEl = imgContainer.tagName === 'PICTURE' ? imgContainer : imgContainer.querySelector('picture') || imgContainer.querySelector('img') || imgContainer;
    }

    // Find text block: look for .d-html-content-block or fallback to first <h3> and following <div>
    let textBlock = col.querySelector('.d-html-content-block');
    if (!textBlock) {
      // Defensive fallback: try to find heading and paragraph
      const heading = col.querySelector('h3, h2, h1');
      const desc = col.querySelector('p');
      if (heading || desc) {
        textBlock = document.createElement('div');
        if (heading) textBlock.appendChild(heading);
        if (desc) textBlock.appendChild(desc);
      }
    }
    return [imageEl, textBlock];
  }

  // Get all immediate child columns (cards)
  const cardCols = Array.from(element.children);
  const rows = [];

  // Table header
  rows.push(['Cards (cards10)']);

  // Each card column becomes a row
  cardCols.forEach((col) => {
    // Defensive: skip empty columns
    if (!col || !col.querySelector) return;
    const [imageEl, textBlock] = extractCardContent(col);
    // Only add row if both image and text exist
    if (imageEl && textBlock) {
      rows.push([imageEl, textBlock]);
    }
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
