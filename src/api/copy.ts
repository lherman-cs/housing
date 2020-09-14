export function copy<T extends any>(src: T, dst: T) {
  for (const k in src) {
    const v = src[k] as any;

    if (v && typeof v.clone === "function") {
      dst[k] = v.clone();
    } else {
      dst[k] = v;
    }
  }

  return dst;
}
