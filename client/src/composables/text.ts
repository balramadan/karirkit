/**
 * The function `getInials` takes a name as input and returns the initials of the name in uppercase.
 * @param {String} name - String - the full name of a person
 * @returns The function `getInials` is returning the initials of the input `name` as a string in
 * uppercase format. If the input `name` is empty or falsy, it will return "J".
 */
export function getInitials(name: String) {
  if (!name) return "J";
  const nameParts = name.split(" ");
  let initials = "";
  for (let i = 0; i < nameParts.length; i++) {
    initials += nameParts[i].charAt(0);
  }

  return initials.toUpperCase();
};
