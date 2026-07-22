export function getEnv(name: string): string;
export function getEnv(name: string, required: true): string;
export function getEnv(name: string, required: false): string | undefined;

export function getEnv(name: string, required = true) {
  const value = Deno.env.get(name);

  if (required && value === undefined) {
    console.error(`${name} is not provided!`);
    Deno.exit(1);
  }

  return value;
}
