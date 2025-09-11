/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block inside the carousel
  const teaser = element.querySelector('.teaser--stage-full');
  if (!teaser) return;

  // --- IMAGE ROW ---
  // Find the image inside the teaser__media > picture > img
  let imgEl = null;
  const media = teaser.querySelector('.teaser__media');
  if (media) {
    const picture = media.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
  }

  // --- CONTENT ROW ---
  // Find the title and subheading
  let contentEls = [];
  const auxWrapper = teaser.querySelector('.teaser__aux-wrapper');
  if (auxWrapper) {
    // The cover contains the text content
    const cover = auxWrapper.querySelector('.teaser__cover');
    if (cover) {
      // Get all headings and paragraphs inside cover
      const headings = cover.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = cover.querySelectorAll('p');
      headings.forEach(h => contentEls.push(h));
      paragraphs.forEach(p => contentEls.push(p));
    }
  }

  // Build the table rows
  const headerRow = ['Hero (hero13)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
