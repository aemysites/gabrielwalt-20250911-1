/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a slider item
  function extractCard(item) {
    // Find image (mandatory)
    let img = item.querySelector('img');
    // Defensive: if image is inside <picture>, use <picture>
    let picture = img ? img.closest('picture') : null;
    let imageEl = picture || img;
    // Find title (heading)
    let heading = item.querySelector('.d-base-heading, [role="heading"]');
    // Find description (paragraph)
    let desc = item.querySelector('.d-base-card__content p, .d-teaser-box__text p, p');
    // Find CTA (the link itself)
    let link = item.closest('a');
    let cta = null;
    if (link) {
      // Create a link element for CTA
      cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = link.getAttribute('aria-label') || heading?.textContent?.trim() || link.textContent?.trim() || 'Learn more';
      cta.target = link.target || '_self';
      cta.rel = link.rel || 'noopener noreferrer';
    }
    // Compose text cell: heading, description, CTA
    let textCell = [];
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);
    return [imageEl, textCell];
  }

  // Find all slider items (cards)
  const items = element.querySelectorAll('.d-new-base-slider__item');
  const rows = [];
  // Header row
  rows.push(['Cards (cards30)']);
  // Card rows
  items.forEach(item => {
    rows.push(extractCard(item));
  });

  // Build table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
