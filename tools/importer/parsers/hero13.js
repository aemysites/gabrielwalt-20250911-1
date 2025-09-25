/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get the first matching descendant
  function findFirstDescendant(parent, selector) {
    const el = parent.querySelector(selector);
    return el || null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero13)'];

  // 2. Background image row (row 2)
  // Find the main image inside the .teaser__media picture
  let imageEl = null;
  const teaserMedia = element.querySelector('.teaser__media picture');
  if (teaserMedia) {
    imageEl = findFirstDescendant(teaserMedia, 'img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row (row 3)
  // Find the title and subheading
  let contentEls = [];
  // The content is inside .teaser__aux-wrapper .teaser__cover
  const auxWrapper = element.querySelector('.teaser__aux-wrapper');
  if (auxWrapper) {
    // Find the cover (should be only one)
    const cover = findFirstDescendant(auxWrapper, '.teaser__cover');
    if (cover) {
      // Find h1 and p inside the cover
      const h1 = findFirstDescendant(cover, 'h1');
      if (h1) contentEls.push(h1);
      const p = findFirstDescendant(cover, 'p');
      if (p) contentEls.push(p);
    }
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
