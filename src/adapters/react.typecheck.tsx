import { LoaderszLoader } from './react';

const directElement = <loadersz-loader state="solving" size={160} speed={1.1} force-motion />;
const wrappedElement = <LoaderszLoader state="forging" size={160} ariaLabel="Forging" />;

// @ts-expect-error Invalid semantic state names must be rejected in React JSX.
const invalidElement = <loadersz-loader state="not-a-loader" />;

void directElement;
void wrappedElement;
void invalidElement;
