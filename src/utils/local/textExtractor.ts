export function ExtractMatchString(text: string, searchKey: string): { value: string; id: number; isMatch: boolean }[]{
    if (!text || !searchKey) return [];

  const regex = new RegExp(`(${searchKey})`, "gi"); // capture the searchKey
  const parts = text.split(regex);

  let id = 0;
  return parts
    .filter(part => part.length > 0) // remove empty strings
    .map(part => ({
      value: part,
      id: id++,
      isMatch: part.toLowerCase() === searchKey.toLowerCase()
    }));
}