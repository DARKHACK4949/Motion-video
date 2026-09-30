import React from "react";
import { PRODUCTS, ProductConfig } from "../config/products";
import { Product } from "./Product";

/** All products share the stage stacking context with story decor, so leaves/capsules can sit between them. */
export const ProductGroup: React.FC<{ products?: ProductConfig[] }> = ({ products = PRODUCTS }) => (
  <>
    {products.map((p) => (
      <Product key={p.id} product={p} />
    ))}
  </>
);
