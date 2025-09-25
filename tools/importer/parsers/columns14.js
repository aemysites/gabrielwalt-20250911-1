/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser-newsletter block
  const teaser = element.querySelector('.teaser-newsletter');
  if (!teaser) return;

  // Find the image (picture or img)
  let imageEl = null;
  const pictureWrapper = teaser.querySelector('.teaser-newsletter__picture-wrapper');
  if (pictureWrapper) {
    imageEl = pictureWrapper.querySelector('img');
  }

  // Find the content column
  const contentCol = teaser.querySelector('.teaser-newsletter__content');

  // Defensive: if missing either column, abort
  if (!imageEl || !contentCol) return;

  // Build the header row
  const headerRow = ['Columns (columns14)'];

  // Build the second row: left = image, right = content
  // Use the image element directly
  // For the right cell, use the entire contentCol element
  const cells = [
    headerRow,
    [imageEl, contentCol]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
