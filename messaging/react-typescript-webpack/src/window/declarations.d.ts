// https://webpack.js.org/guides/typescript/#importing-other-assets
declare module "*.png" {
  const imageUrl: string;
  export default imageUrl;
}
