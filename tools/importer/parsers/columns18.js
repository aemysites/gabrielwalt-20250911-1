/* global WebImporter */
export default function parse(element, { document }) {
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  const modalMask = getChildByClass(element, 'p-dialog-mask');
  if (!modalMask) return;

  const modalDialog = getChildByClass(modalMask, 'p-dialog');
  if (!modalDialog) return;

  const dialogContent = getChildByClass(modalDialog, 'p-dialog-content');
  if (!dialogContent) return;

  const entryGate = Array.from(dialogContent.children).find(child => child.classList.contains('d-entry-gate'));
  if (!entryGate) return;

  const imageContainer = getChildByClass(entryGate, 'd-entry-gate__image-container');
  let leftImage = null;
  if (imageContainer) {
    leftImage = imageContainer.querySelector('img');
  }

  const contentContainer = getChildByClass(entryGate, 'd-entry-gate__content-container');
  let rightContent = [];
  if (contentContainer) {
    const heading = contentContainer.querySelector('.d-entry-gate__heading');
    if (heading) rightContent.push(heading);
    const decision = contentContainer.querySelector('.d-entry-gate__decision');
    if (decision) rightContent.push(decision);
    const disclaimer = contentContainer.querySelector('.d-entry-gate__disclaimer');
    if (disclaimer) rightContent.push(disclaimer);
  }

  const footer = entryGate.querySelector('.d-entry-gate__footer');
  let footerContent = [];
  if (footer) {
    const homeLink = footer.querySelector('.d-entry-gate__home-link');
    if (homeLink) footerContent.push(homeLink);
    const acceptButton = footer.querySelector('button');
    if (acceptButton) footerContent.push(acceptButton);
  }

  const headerRow = ['Columns (columns18)'];
  const columnsRow = [
    leftImage ? leftImage : '',
    rightContent.length ? rightContent : ''
  ];
  // Fix: Only add a footer row if there is content, and do not add unnecessary empty columns
  const cells = [headerRow, columnsRow];
  if (footerContent.length) {
    cells.push([footerContent]); // Only one column for the footer row
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
