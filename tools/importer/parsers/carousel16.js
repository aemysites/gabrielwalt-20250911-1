/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the <img> from a <picture>
  function getImageFromPicture(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Find the main container for the carousel slides
  // Defensive: look for .teaser__container or .teaser__menu's sibling
  let container = element.querySelector('.teaser__container');
  if (!container) {
    // fallback: maybe the element itself is the container
    container = element;
  }

  // All slides are .teaser inside the container (but not .teaser__menu)
  const slides = Array.from(container.querySelectorAll('.teaser'));

  // Prepare the table rows
  const rows = [];
  // Header row as per requirements
  rows.push(['Carousel (carousel16)']);

  slides.forEach((slide) => {
    // Image cell
    const media = slide.querySelector('.teaser__media');
    let img = null;
    if (media) {
      const picture = media.querySelector('picture');
      img = getImageFromPicture(picture);
    }

    // Text cell
    let textCellContent = [];
    const cover = slide.querySelector('.teaser__cover');
    if (cover) {
      // Title
      const title = cover.querySelector('.teaser__title-cover');
      if (title) textCellContent.push(title);
      // Description
      const copy = cover.querySelector('.teaser__copy-cover');
      if (copy) {
        // Only keep <p> and <a> inside copy
        const ps = Array.from(copy.querySelectorAll('p'));
        const ctas = Array.from(copy.querySelectorAll('a'));
        textCellContent = textCellContent.concat(ps);
        textCellContent = textCellContent.concat(ctas);
      }
    }
    // Remove empty text cell
    if (textCellContent.length === 0) textCellContent = [''];
    // Add row: [image, text]
    rows.push([
      img || '',
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
