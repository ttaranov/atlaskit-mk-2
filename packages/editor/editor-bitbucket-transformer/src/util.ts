/**
 * A replacement for `Array.from` until it becomes widely implemented.
 */
function arrayFrom(obj: any): any[] {
  return Array.prototype.slice.call(obj);
}

/**
 * A replacement for `String.repeat` until it becomes widely available.
 */
export function stringRepeat(text: string, length: number): string {
  let result = '';
  for (let x = 0; x < length; x++) {
    result += text;
  }
  return result;
}

/**
 * This function escapes all plain-text sequences that might get converted into markdown
 * formatting by Bitbucket server (via python-markdown).
 * @see MarkdownSerializerState.esc()
 */
export function escapeMarkdown(str: string, startOfLine?: boolean): string {
  let strToEscape = str || '';
  strToEscape = strToEscape.replace(/[`*\\+_|()\[\]{}]/g, '\\$&');
  if (startOfLine) {
    strToEscape = strToEscape
      .replace(/^[#-&(-*]/, '\\$&') // Don't escape ' character
      .replace(/^(\d+)\./, '$1\\.');
  }
  return strToEscape;
}

/**
 * This function gets markup rendered by Bitbucket server and transforms it into markup that
 * can be consumed by Prosemirror HTML parser, conforming to our schema.
 */
export function transformHtml(
  html: string,
  options: { disableBitbucketLinkStripping?: boolean },
): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = html;

  // Remove zero-width-non-joiner
  arrayFrom(el.querySelectorAll('p')).forEach((p: HTMLParagraphElement) => {
    const zwnj = /\u200c/g;
    if (p.textContent && zwnj.test(p.textContent)) {
      p.textContent = p.textContent.replace(zwnj, '');
    }
  });

  // Convert mention containers, i.e.:
  //   <a href="/abodera/" rel="nofollow" title="@abodera" class="mention mention-me">Artur Bodera</a>
  arrayFrom(el.querySelectorAll('a.mention')).forEach((a: HTMLLinkElement) => {
    const span = document.createElement('span');
    span.setAttribute('class', 'editor-entity-mention');
    span.setAttribute('contenteditable', 'false');

    const title = a.getAttribute('title') || '';
    if (title) {
      const usernameMatch = title.match(/^@(.*?)$/);
      if (usernameMatch) {
        const username = usernameMatch[1];
        span.setAttribute('data-mention-id', username);
      }
    }

    const text = a.textContent || '';
    if (text.indexOf('@') === 0) {
      span.textContent = a.textContent;
    } else {
      span.textContent = `@${a.textContent}`;
    }

    a.parentNode!.insertBefore(span, a);
    a.parentNode!.removeChild(a);
  });

  // Parse emojis i.e.
  //     <img src="https://d301sr5gafysq2.cloudfront.net/207268dc597d/emoji/img/diamond_shape_with_a_dot_inside.svg" alt="diamond shape with a dot inside" title="diamond shape with a dot inside" class="emoji">
  arrayFrom(el.querySelectorAll('img.emoji')).forEach(
    (img: HTMLImageElement) => {
      const span = document.createElement('span');
      let shortName = img.getAttribute('data-emoji-short-name') || '';

      if (!shortName) {
        // Fallback to parsing Bitbucket's src attributes to find the
        // short name
        const src = img.getAttribute('src');
        const idMatch = !src ? false : src.match(/([^\/]+)\.[^\/]+$/);

        if (idMatch) {
          shortName = `:${decodeURIComponent(idMatch[1])}:`;
        }
      }

      if (shortName) {
        span.setAttribute('data-emoji-short-name', shortName);
      }

      img.parentNode!.insertBefore(span, img);
      img.parentNode!.removeChild(img);
    },
  );

  if (!options.disableBitbucketLinkStripping) {
    // Convert all automatic links to plain text, because they will be re-created on render by the server
    arrayFrom(el.querySelectorAll('a'))
      // Don't convert external links (i.e. not automatic links)
      .filter(
        (a: HTMLLinkElement) =>
          a.getAttribute('data-is-external-link') !== 'true',
      )
      .forEach((a: HTMLLinkElement) => {
        const text = document.createTextNode(a.innerText);
        a.parentNode!.insertBefore(text, a);
        a.parentNode!.removeChild(a);
      });
  }

  // Parse images
  arrayFrom(el.querySelectorAll('img:not(.emoji)')).forEach(
    (img: HTMLImageElement) => {
      const mediaSingle = document.createElement('div');
      mediaSingle.setAttribute('data-node-type', 'mediaSingle');

      const media = document.createElement('div');
      media.setAttribute('data-node-type', 'media');
      media.setAttribute('data-type', 'external');
      media.setAttribute('data-url', img.getAttribute('src')!);

      mediaSingle.appendChild(media);

      const { parentNode } = img;

      if (parentNode) {
        // parentNode is root-element
        if (parentNode === el) {
          parentNode.insertBefore(mediaSingle, img);
        } else {
          const { childNodes } = parentNode;
          if (childNodes.length === 1) {
            parentNode.parentNode!.insertBefore(mediaSingle, parentNode);
            parentNode.parentNode!.removeChild(parentNode);
          } else {
            let parent = parentNode;

            if (parentNode.nodeName === 'LI') {
              parent = document.createElement('p');
              while (parentNode.firstChild) {
                parent.appendChild(parentNode.firstChild);
              }
              parentNode.appendChild(parent);
            }

            const before: DocumentFragment = new DocumentFragment();
            const after: DocumentFragment = new DocumentFragment();
            let foundImg = false;

            Array.from(parent.childNodes).forEach(child => {
              if (child === img) {
                foundImg = true;
                parent.removeChild(child);
              } else {
                if (foundImg) {
                  after.appendChild(child);
                } else {
                  before.appendChild(child);
                }
              }
            });

            if (before.childNodes.length) {
              const beforeNode = parent.cloneNode();
              beforeNode.appendChild(before);

              parent.parentNode!.insertBefore(beforeNode, parent);
            }

            parent.parentNode!.insertBefore(mediaSingle, parent);

            if (after.childNodes.length) {
              const afterNode = parent.cloneNode();
              afterNode.appendChild(after);
              parent.parentNode!.insertBefore(afterNode, parent);
            }

            parent.parentNode!.removeChild(parent);
          }
        }

        try {
          parentNode.removeChild(img);
        } catch (err) {}
      }
    },
  );

  return el;
}
