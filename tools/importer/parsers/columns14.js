/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main newsletter teaser block
  const teaser = element.querySelector('.teaser-newsletter');
  if (!teaser) return;

  // Get the image column (left)
  const pictureWrapper = teaser.querySelector('.teaser-newsletter__picture-wrapper');
  let imageContent = null;
  if (pictureWrapper) {
    // Use the entire picture wrapper (contains <picture> and <img>)
    imageContent = pictureWrapper;
  }

  // Get the content column (right)
  const contentWrapper = teaser.querySelector('.teaser-newsletter__content');
  let contentColumn = document.createElement('div');
  if (contentWrapper) {
    // Defensive: Only keep relevant content (title, copy, form, subscribe button)
    // We'll collect: h3, p, form, subscribe button, and the privacy notice span
    const title = contentWrapper.querySelector('.teaser-newsletter__title');
    const copy = contentWrapper.querySelector('.teaser-newsletter__copy');
    const form = contentWrapper.querySelector('form');
    const subscribeBtn = contentWrapper.querySelector('a.btn');
    // The privacy notice span is inside the checkbox field
    let privacySpan = null;
    const checkboxField = contentWrapper.querySelector('.input-material--checkbox .form__field');
    if (checkboxField) {
      privacySpan = checkboxField.querySelector('span');
    }
    // Compose the column
    if (title) contentColumn.appendChild(title);
    if (copy) contentColumn.appendChild(copy);
    if (form) contentColumn.appendChild(form);
    if (privacySpan) contentColumn.appendChild(privacySpan);
    if (subscribeBtn) contentColumn.appendChild(subscribeBtn);
  }

  // Table header
  const headerRow = ['Columns (columns14)'];
  // Table content row: left = image, right = content
  const contentRow = [imageContent, contentColumn];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
