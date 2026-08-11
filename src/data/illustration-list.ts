const imageHost = (process.env.NEXT_PUBLIC_IMG_HOST ?? '').replace(/\/+$/, '');
const withHost = (path: string) => `${imageHost}${path}`;

export default [
