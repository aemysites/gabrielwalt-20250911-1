/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first <img> inside a <picture>
  function getImgFromPicture(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Find the carousel container
  const teaserContainer = element.querySelector('.teaser__container');
  if (!teaserContainer) return;

  // Find all slides ('.teaser' direct children)
  const teasers = Array.from(teaserContainer.querySelectorAll(':scope > .t--bg-2 > .teaser'));
  if (!teasers.length) return;

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel16)'];
  rows.push(headerRow);

  teasers.forEach((teaser) => {
    // Image cell
    const picture = teaser.querySelector('.teaser__media picture');
    const img = getImgFromPicture(picture);
    let imageCell = img || '';

    // Text cell
    const cover = teaser.querySelector('.teaser__cover');
    let textCellContent = [];
    if (cover) {
      // Title
      const title = cover.querySelector('.teaser__title-cover');
      if (title) {
        // Use h2 for heading as in source
        textCellContent.push(title);
      }
      // Description
      const copy = cover.querySelector('.teaser__copy-cover');
      if (copy) {
        // Paragraph(s)
        const paragraphs = Array.from(copy.querySelectorAll('p'));
        textCellContent.push(...paragraphs);
        // CTA (link)
        const cta = copy.querySelector('a');
        if (cta) {
          textCellContent.push(cta);
        }
      }
    }
    // Defensive: if no text, cell is empty string
    const textCell = textCellContent.length ? textCellContent : '';

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
