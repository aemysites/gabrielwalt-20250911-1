/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first active hero slide
  const activeSlide = element.querySelector('.d-new-base-slider__item.d-new-base-slider__item--active');
  if (!activeSlide) return;

  // Get the hero image (prefer <picture>, fallback to <img>)
  let imageCell = null;
  const heroImageContainer = activeSlide.querySelector('.d-teaser-hero__image-container');
  if (heroImageContainer) {
    const picture = heroImageContainer.querySelector('picture');
    if (picture) {
      imageCell = picture.cloneNode(true);
    } else {
      const img = heroImageContainer.querySelector('img');
      if (img) imageCell = img.cloneNode(true);
    }
  }

  // Get the hero content (heading, text, CTA)
  // Instead of grabbing the whole box, extract and combine the relevant parts
  const contentParts = [];
  const heroContentBox = activeSlide.querySelector('.d-teaser-hero__content--box');
  if (heroContentBox) {
    // Heading (h1 or .d-teaser-hero__heading)
    const heading = heroContentBox.querySelector('h1, .d-teaser-hero__heading');
    if (heading) contentParts.push(heading.cloneNode(true));
    // Subheading (first .d-teaser-hero_text or .d-teaser-hero__text)
    const subheading = heroContentBox.querySelector('.d-teaser-hero_text, .d-teaser-hero__text');
    if (subheading) contentParts.push(subheading.cloneNode(true));
    // CTA (button or link)
    const cta = heroContentBox.querySelector('.d-teaser-hero__button_container a, .d-teaser-hero__button_container button');
    if (cta) contentParts.push(cta.cloneNode(true));
  }
  // Fallback: if nothing found, try to grab the whole hero content
  if (contentParts.length === 0) {
    const heroContent = activeSlide.querySelector('.d-teaser-hero__content');
    if (heroContent) contentParts.push(heroContent.cloneNode(true));
    else contentParts.push(activeSlide.cloneNode(true));
  }

  // Compose table rows
  const headerRow = ['Hero (hero33)'];
  const imageRow = [imageCell];
  const contentRow = [contentParts];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
