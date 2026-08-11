const imageHost = (process.env.NEXT_PUBLIC_IMG_HOST ?? '').replace(/\/+$/, '');
const withHost = (path: string) => `${imageHost}${path}`;

export default [
  {url: withHost('/illustration/1.jpg')},
  {url: withHost('/illustration/2.jpg')},
  {url: withHost('/illustration/3.jpg')},
  {url: withHost('/illustration/4.jpg')},
  {url: withHost('/illustration/6.jpg')},
  {url: withHost('/illustration/5.jpg')},
  {url: withHost('/illustration/7.jpg')},
  {url: withHost('/illustration/8.jpg')},
  {url: withHost('/illustration/9.jpg')},
  {url: withHost('/illustration/10.jpg')},
  {url: withHost('/illustration/11.jpg')},
  // {url: withHost('/illustration/12.jpg')},
  // {url: withHost('/illustration/13.png')},
];
