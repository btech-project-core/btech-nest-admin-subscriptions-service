/* eslint-disable @typescript-eslint/no-unused-vars */
export const validateEmail = (email: string): boolean =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-()]+/g, '');
  return /^\+?[0-9]{7,15}$/.test(cleanPhone);
};

export const validateDocumentNumber = (docNumber: string): boolean =>
  docNumber.length >= 3 && /^[A-Za-z0-9]+$/.test(docNumber);

export const validateUsername = (username: string): boolean =>
  username.length >= 3 && /^[a-zA-Z0-9._-]+$/.test(username);

export const validateRole = (role: number): boolean => [1, 2].includes(role);

export const checkDuplicates = <T>(
  items: T[],
  getField: (item: T) => string,
): string[] => {
  const fieldCounts = new Map<string, number[]>();

  items.forEach((item, index) => {
    const value = getField(item).toLowerCase().trim();
    if (!fieldCounts.has(value)) fieldCounts.set(value, []);
    fieldCounts.get(value)!.push(index + 2);
  });

  return Array.from(fieldCounts.entries())
    .filter(([_, indices]) => indices.length > 1)
    .map(
      ([value, indices]) =>
        `'${value}' duplicado en filas: ${indices.join(', ')}`,
    );
};
