export const list = (items: string[], max = 3) => {
  if (items.length == 0) {
    return "";
  }
  if (items.length == 1) {
    return items[0];
  }
  if (items.length <= max) {
    const tail = items[items.length - 1];
    const head = items.slice(0, items.length - 1);
    return head.join(", ") + " & " + tail;
  }

  return items.slice(0, max).join(", ") + " & others";
};
