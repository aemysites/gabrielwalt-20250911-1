/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (first <img> in card)
  function getCardImage(card) {
    const img = card.querySelector('.d-base-card__header img, picture img');
    if (img) {
      // If parent is <picture>, return the <picture> element
      if (img.parentElement && img.parentElement.tagName.toLowerCase() === 'picture') {
        return img.parentElement.cloneNode(true);
      }
      return img.cloneNode(true);
    }
    return '';
  }

  // Helper to extract all text content for the card
  function getCardText(card, link) {
    const frag = document.createDocumentFragment();

    // Date
    const date = card.querySelector('.d-teaser-box__date, .d-base-card__date');
    if (date) {
      Array.from(date.childNodes).forEach((node) => frag.appendChild(node.cloneNode(true)));
    }

    // Tags
    const tags = card.querySelector('.d-base-tag-list, .d-teaser-box__tags');
    if (tags) {
      Array.from(tags.childNodes).forEach((node) => frag.appendChild(node.cloneNode(true)));
    }

    // Title (heading)
    const heading = card.querySelector('.d-teaser-box__heading, .d-base-heading');
    if (heading) {
      Array.from(heading.childNodes).forEach((node) => frag.appendChild(node.cloneNode(true)));
    }

    // Description (all paragraphs in content)
    const content = card.querySelector('.d-base-card__content');
    if (content) {
      Array.from(content.childNodes).forEach((node) => frag.appendChild(node.cloneNode(true)));
    }

    // CTA (link)
    if (link && link.href) {
      let ctaText = '';
      if (heading) {
        ctaText = heading.textContent.trim();
      } else {
        ctaText = link.textContent.trim();
      }
      if (ctaText) {
        const cta = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = ctaText;
        cta.appendChild(a);
        frag.appendChild(cta);
      }
    }

    return frag;
  }

  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Get all card items
  const cardItems = element.querySelectorAll(':scope > .d-teaser-boxes-stack__item');

  cardItems.forEach((item) => {
    const link = item.querySelector('a');
    const card = item.querySelector('.d-base-card');
    if (!card) return;

    // Image cell
    const img = getCardImage(card);
    // Text cell
    const textFrag = getCardText(card, link);
    // Ensure all text content is included
    const textCell = Array.from(textFrag.childNodes);

    rows.push([
      img ? img : '',
      textCell.length ? textCell : '',
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
