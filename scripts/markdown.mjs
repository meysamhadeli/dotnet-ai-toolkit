export function mapMarkdownProse(markdown, transform) {
  let fence = null;
  return markdown.split(/\r?\n/).map(line => {
    const delimiter = line.match(/^\s*(`{3,}|~{3,})/);
    if (delimiter) {
      if (!fence) fence = delimiter[1];
      else if (delimiter[1][0] === fence[0] && delimiter[1].length >= fence.length) fence = null;
      return line;
    }
    if (fence) return line;
    return line.split(/(`+[^`]*`+)/g).map((part, index) => index % 2 ? part : transform(part)).join('');
  }).join('\n');
}
