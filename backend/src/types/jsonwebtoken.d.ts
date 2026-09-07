// Type declarations for jsonwebtoken
declare module "jsonwebtoken" {
  interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    issuer?: string;
    jwtid?: string;
    subject?: string;
    noTimestamp?: boolean;
    keyid?: string;
    mutatePayload?: boolean;
  }

  interface VerifyOptions {
    algorithm?: string | string[];
    audience?: string | string[];
    issuer?: string | string[];
    jwtid?: string;
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    subject?: string;
    clockTolerance?: number;
    maxAge?: string | number;
    clockTimestamp?: number;
    nonce?: string;
    complete?: boolean;
  }

  interface DecodeOptions {
    complete?: boolean;
    json?: boolean;
  }

  function sign(
    payload: string | object | Buffer,
    secret: string | Buffer,
    options?: SignOptions
  ): string;
  function verify(
    token: string,
    secret: string | Buffer,
    options?: VerifyOptions
  ): string | object;
  function decode(
    token: string,
    options?: DecodeOptions
  ): null | { [key: string]: unknown };

  export { sign, verify, decode, SignOptions, VerifyOptions, DecodeOptions };
}
