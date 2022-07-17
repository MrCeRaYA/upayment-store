import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Grid, CirclesWithBar } from "react-loader-spinner";

import type ProductModel from "models/product";
import { useState } from "react";

export function ProductCard(props: { data: ProductModel }) {
  const { data } = props;
  const navigate = useNavigate();
  const [error, toggleError] = useState(false);

  return (
    <li
      onClick={() => navigate(`/products/${data.id}`, { state: data })}
      className="cursor-pointer flex flex-col p-4 bg-gray-700 text-white rounded"
    >
      <div className="bg-gray-400 mb-4">
        {error ? (
          <CirclesWithBar
            width={"100%"}
            color="black"
            wrapperClass="aspect-square items-center"
          />
        ) : (
          <LazyLoadImage
            className="aspect-square object-cover h-full w-full"
            placeholder={<Grid />}
            onError={() => toggleError(true)}
            src={data.avatar}
            alt={data.name}
          />
        )}
      </div>
      <p className="text-center text-xl my-auto">{data.name}</p>
      <p className="text-right">
        Price: <span className="text-2xl">${data.price}</span>
      </p>
    </li>
  );
}
