/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate children with a given class
  function getImmediateChildrenByClass(parent, className) {
    return Array.from(parent.children).filter((el) => el.classList.contains(className));
  }

  // Find the two main columns
  const cols = getImmediateChildrenByClass(element, 'd-teaser-www__body__col');
  // Defensive: fallback if above fails
  if (cols.length < 2) {
    // fallback: just use all direct children
    cols.push(...element.querySelectorAll(':scope > div'));
  }

  // Left column: text, heading, dropdown
  const leftCol = cols[0];
  // Right column: links
  const rightCol = cols[1];

  // Defensive: if columns are missing, create empty divs
  const leftContent = leftCol || document.createElement('div');
  const rightContent = rightCol || document.createElement('div');

  // Compose the columns cell content
  // Left: gather all children of leftCol
  const leftColContent = Array.from(leftContent.childNodes).filter((node) => {
    // Remove empty paragraphs and whitespace-only nodes
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && !node.textContent.trim()) return false;
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
    return true;
  });

  // Right: gather all children of rightCol
  const rightColContent = Array.from(rightContent.childNodes).filter((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && !node.textContent.trim()) return false;
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
    return true;
  });

  // Table structure: header, then one row with two columns
  const headerRow = ['Columns (columns37)'];
  const contentRow = [leftColContent, rightColContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
