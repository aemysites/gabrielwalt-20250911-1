/* global WebImporter */
export default function parse(element, { document }) {
  // Find all slider items (each hero slide)
  const sliderItems = element.querySelectorAll('.d-new-base-slider__item');
  if (!sliderItems.length) return;

  sliderItems.forEach((item) => {
    // 1. Header row
    const headerRow = ['Hero (hero33)'];

    // 2. Background image (picture or img inside .d-teaser-hero__image-container)
    let bgImage = '';
    const imgContainer = item.querySelector('.d-teaser-hero__image-container');
    if (imgContainer) {
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        bgImage = picture.cloneNode(true);
      } else {
        const img = imgContainer.querySelector('img');
        if (img) bgImage = img.cloneNode(true);
      }
    }
    const imageRow = [bgImage];

    // 3. Text content (title, subtitle, CTA)
    let textContent = [];
    const contentBox = item.querySelector('.d-teaser-hero__content--box');
    if (contentBox) {
      // Get all heading elements (h1, h2, h3, .d-base-heading--h1, .d-base-heading--h2, .d-base-heading--h3)
      const headingEls = contentBox.querySelectorAll('h1, h2, h3, .d-base-heading--h1, .d-base-heading--h2, .d-base-heading--h3');
      headingEls.forEach((el) => {
        if (el.textContent.trim()) textContent.push(el.cloneNode(true));
      });
      // Get all paragraphs (including those in .d-teaser-hero_text)
      const paragraphs = contentBox.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) textContent.push(p.cloneNode(true));
      });
      // Get all CTA links/buttons
      const ctas = contentBox.querySelectorAll('a, button');
      ctas.forEach((cta) => {
        if (cta.textContent.trim()) textContent.push(cta.cloneNode(true));
      });
    }
    const textRow = [textContent.length ? textContent : ''];

    // Compose table
    const cells = [headerRow, imageRow, textRow];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    item.replaceWith(block);
  });
}
