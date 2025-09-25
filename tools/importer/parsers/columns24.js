/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block
  const hero = element.querySelector('.d-teaser-hero');
  if (!hero) return;

  // Left column: heading and text
  const leftBox = hero.querySelector('.d-teaser-hero__content--box');
  let leftCol = null;
  if (leftBox) {
    // Reference the actual heading and text containers
    leftCol = document.createElement('div');
    // Heading
    const heading = leftBox.querySelector('.d-teaser-hero__heading');
    if (heading) leftCol.appendChild(heading);
    // Text
    const text = leftBox.querySelector('.d-teaser-hero__text');
    if (text) leftCol.appendChild(text);
  }

  // Right column: image only
  let rightCol = null;
  const imgContainer = hero.querySelector('.d-teaser-hero__image-container');
  if (imgContainer) {
    const img = imgContainer.querySelector('img');
    if (img) rightCol = img;
  }

  // Build the table
  const headerRow = ['Columns (columns24)'];
  const row = [leftCol, rightCol].filter(Boolean); // Only non-empty columns
  const table = WebImporter.DOMUtils.createTable([headerRow, row], document);

  element.replaceWith(table);
}
