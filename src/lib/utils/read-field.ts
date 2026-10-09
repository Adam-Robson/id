export const readField = (form: HTMLFormElement, name: string): string | null => {
  return (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? null;
}
