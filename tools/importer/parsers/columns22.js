/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main container for the block
  const container = element.querySelector('.d-footer-top__container');
  if (!container) return;

  // Column 1: Culture Switch
  const cultureSwitch = container.querySelector('.d-footer-top__culture-switch');

  // Column 2: Contact, Newsletter, Social Media
  const rightSection = container.querySelector('.d-footer-top__right-section');
  let contactAndNewsletter = null;
  let socialMedia = null;
  if (rightSection) {
    contactAndNewsletter = rightSection.querySelector('.d-footer-top__right-section__contact-and-newsletter');
    socialMedia = rightSection.querySelector('.d-footer-top__right-section__social-media');
  }

  // Compose column 2 cell content
  const column2Content = [];
  if (contactAndNewsletter) column2Content.push(contactAndNewsletter);
  if (socialMedia) column2Content.push(socialMedia);

  // Table header
  const headerRow = ['Columns (columns22)'];
  // Table content row: two columns
  const contentRow = [cultureSwitch, column2Content];

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
