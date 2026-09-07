declare module '*.ejs' {
  const content: string;
  export default content;
}

// ejs v6 ships no type declarations and @types/ejs only tracks the v3 API,
// so declare the minimal surface this project consumes.
declare module 'ejs' {
  interface EJS {
    compile(template: string): (data?: object) => string;
  }
  const ejs: EJS;
  export default ejs;
}
