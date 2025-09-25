/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Columns (columns28)'];

  // Defensive: find the direct wrapper of all columns
  // The structure is: element > .owl-wrapper-outer > .owl-wrapper > .owl-item*
  // Each .owl-item contains a column (teaser)
  let wrapper = element.querySelector('.owl-wrapper');
  if (!wrapper) {
    // fallback: maybe .owl-wrapper-outer is the direct child
    wrapper = element.querySelector('.owl-wrapper-outer');
    if (wrapper) wrapper = wrapper.querySelector('.owl-wrapper');
  }
  if (!wrapper) {
    // fallback: maybe element itself is the wrapper
    wrapper = element;
  }

  // Get all visible columns (owl-item)
  const items = Array.from(wrapper.querySelectorAll(':scope > .owl-item'));
  if (!items.length) {
    // fallback: maybe teasers are direct children
    const teasers = Array.from(wrapper.querySelectorAll(':scope > .teaser'));
    if (teasers.length) {
      items.push(...teasers);
    }
  }

  // Each column is the full content of .teaser inside .owl-item
  const columns = items.map(item => {
    // Defensive: find the .teaser inside each .owl-item
    const teaser = item.querySelector('.teaser') || item;
    return teaser;
  });

  // Build the table rows
  const rows = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
