export function getButton(selector: string): HTMLButtonElement {
  return document.querySelector(selector)!;
}

export function getButtons(selector: string): HTMLButtonElement[] {
  return document.querySelectorAll(selector) as any;
}

export function getInput(selector: string): HTMLInputElement {
  return document.querySelector(selector)!;
}

export function getParagraph(selector: string): HTMLParagraphElement {
  return document.querySelector(selector)!;
}

export function getParagraphs(selector: string): HTMLParagraphElement[] {
  return document.querySelectorAll(selector) as any;
}

export function getSpan(selector: string): HTMLSpanElement {
  return document.querySelector(selector) as any;
}

export function getList(selector: string): HTMLUListElement {
  return document.querySelector(selector) as any;
}

export function getDiv(selector: string): HTMLDivElement {
  return document.querySelector(selector) as any;
}

export function createElement({tag, textContent, className, children}: {tag: string, textContent?: string, className?: string, children?: HTMLElement[]}) {
  const entry = document.createElement(tag);
  entry.className = className ?? '';
  entry.textContent = textContent ?? '';
  if (children) {
    for(const c of children) {
      entry.appendChild(c);
    }
  }

  return entry;
}

export function activate(section: string) {
  const allSections = document.querySelectorAll('section');
  for(const s of allSections) {
    if (s.id === section) {
      s.className = 'show';
    }
    else {
      s.className = 'hide';
    }
  }
}
