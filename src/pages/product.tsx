import { MouseEventHandler, useCallback, useEffect, useState } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Rings, Grid, CirclesWithBar } from "react-loader-spinner";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import axios from "utils/axios";

import type ProductModel from "models/product";

export default function Product() {
  const { state } = useLocation() as { state: ProductModel | null };
  const [product, setProduct] = useState(state);
  const [error, toggleError] = useState(false);
  const [isSending, toggleSending] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (product) return;
    axios.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, []);

  const navigate = useNavigate();
  const deleteProduct = useCallback(async () => {
    toggleSending(true);
    try {
      await axios.delete(`/products/${id}`);
      navigate("/");
    } catch (err) {
      // We should log the error here...
      alert("An error occured while trying to delete your product");
    }
  }, []) as MouseEventHandler;

  if (!product || isSending)
    return (
      <Rings
        wrapperClass="w-full h-screen items-center justify-center"
        color="black"
        width={200}
        height={200}
      />
    );

  return (
    <main>
      <section className="relative flex flex-col md:flex-row items-center bg-gray-700 px-7 py-3 rounded gap-4 text-white">
        {error ? (
          <CirclesWithBar
            width={"100%"}
            color="white"
            wrapperClass="aspect-square h-60 w-60 items-center"
          />
        ) : (
          <LazyLoadImage
            className="aspect-square object-cover h-60 w-60 rounded"
            placeholder={<Grid />}
            onError={() => toggleError(true)}
            src={product.avatar}
            alt={product.name}
          />
        )}

        <div>
          <h1 className="text-3xl">{product.name}</h1>
          <h3 className="text-xl">Price: ${product.price}</h3>
        </div>

        <button
          onClick={deleteProduct}
          className="absolute top-3 right-7 bg-red-600 hover:bg-red-700 py-2 px-8 text-xl font-bold rounded border-0"
        >
          Delete
        </button>
      </section>

      <hr className="w-1/2 border-black my-2 mx-auto" />

      <section className="flex-1">
        <h3 className="text-3xl align-left">Description:</h3>
        <p>{product.description}</p>
      </section>
    </main>
  );
}
