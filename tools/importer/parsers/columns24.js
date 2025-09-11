/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main hero block
  const hero = element.querySelector('.d-teaser-hero');
  if (!hero) return;

  // Find the left column (text)
  const contentBox = hero.querySelector('.d-teaser-hero__content--box');
  let leftCol = null;
  if (contentBox) {
    // Use the whole content box for resilience
    leftCol = contentBox;
  } else {
    // Fallback: try to find heading and text
    const heading = hero.querySelector('h1');
    const text = hero.querySelector('.d-teaser-hero_text, p');
    leftCol = document.createElement('div');
    if (heading) leftCol.appendChild(heading);
    if (text) leftCol.appendChild(text);
  }

  // Find the right column (image)
  let rightCol = null;
  const imageContainer = hero.querySelector('.d-teaser-hero__image-container');
  if (imageContainer) {
    // Use the whole image container for resilience
    rightCol = imageContainer;
  } else {
    // Fallback: try to find picture/img
    const picture = hero.querySelector('picture, img');
    if (picture) {
      rightCol = document.createElement('div');
      rightCol.appendChild(picture);
    }
  }

  // Build the table
  const headerRow = ['Columns (columns24)'];
  const contentRow = [leftCol, rightCol];
  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
