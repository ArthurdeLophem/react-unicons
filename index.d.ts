import * as React from "react";

export interface UniconProps {
  color?: string;
  size?: string | number;
  className?: string;
}

/**
 * Base type for all Unicon React components
 */
export type UniconComponent = React.FC<UniconProps>;

/**
 * Each icon (e.g. UilUser, UilArrowRight) is a named export of type UniconComponent.
 */
export const Uil0Plus: UniconComponent;
export const Uil10Plus: UniconComponent;
export const Uil12Plus: UniconComponent;
// ... (list continues — you can generate these automatically if you want)

/**
 * Default export fallback (for wildcard imports)
 */
declare const icons: Record<string, UniconComponent>;
export default icons;
