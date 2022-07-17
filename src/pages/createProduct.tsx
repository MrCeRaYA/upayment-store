import { useEffect, useCallback, useState, FormEventHandler } from "react";

import localforage from "localforage";
import Select from "react-select";
import axios from "utils/axios";

import { useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";

import type CategoryModel from "models/category";
import type ProductModel from "models/product";

export default function CreateProduct() {
  const navigate = useNavigate();

  const [isSending, toggleSending] = useState(false);
  const [categories, setCategories] = useState<CategoryModel[]>([
    { name: "Select...", id: "-1" },
  ]);

  useEffect(() => {
    (async () => {
      const cached = await localforage.getItem<CategoryModel[]>("categories");
      if (cached) return setCategories(cached);

      const categories = await axios.get("/categories");
      setCategories(categories.data);

      await localforage.setItem("categories", categories.data);
    })();
  }, []);

  const saveProduct = useCallback(async (e) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;

    const formData = new FormData(target);
    const props = Object.fromEntries(formData) as any as ProductModel;

    toggleSending(true);
    try {
      await axios.post("/products", props);
      navigate("/");
    } catch (err) {
      // We should log the error here...
      alert("An error occured while trying to create your product");
    } finally {
      target.reset();
    }
  }, []) as FormEventHandler<HTMLFormElement>;

  if (isSending)
    return (
      <Circles
        wrapperClass="w-full h-screen items-center justify-center"
        color="black"
        width={200}
        height={200}
      />
    );

  return (
    <form
      className="mx-auto  min-w-[25%] w-full lg:min-w-[35%] lg:w-fit"
      onSubmit={saveProduct}
    >
      <h1 className="text-3xl my-10 text-center">Create Product</h1>

      <div className="flex flex-col">
        <label htmlFor="name" className="text-xl mb-2">
          Product Name
        </label>
        <input
          minLength={2}
          maxLength={20}
          name="name"
          className="py-2 px-2 mb-4 border rounded border-gray-300"
          placeholder="Type Here..."
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xl mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          minLength={2}
          maxLength={500}
          className="py-2 px-2 mb-4 border rounded border-gray-300"
          name="description"
          placeholder="Type Here..."
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xl mb-2" htmlFor="avatar">
          Image URL
        </label>
        <input
          type="url"
          name="avatar"
          placeholder="Type Here..."
          className="py-2 px-2 mb-4 border rounded border-gray-300"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xl mb-2" htmlFor="category">
          Category
        </label>
        <Select
          name="category"
          isLoading={categories.length == 0}
          className="mb-4 "
          options={categories.map((elm) => ({
            value: elm.id,
            label: elm.name[0].toUpperCase() + elm.name.slice(1).toLowerCase(),
          }))}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xl mb-2" htmlFor="price">
          Price
        </label>
        <input
          min={2}
          max={20000}
          className="py-2 px-2 mb-4 border rounded border-gray-300"
          type="number"
          name="price"
          placeholder="Type Here..."
          required
        />
      </div>

      <input
        className="hidden"
        name="developerEmail"
        value="randomEmailGenerator@gmail.com"
      />

      <button
        type="submit"
        className="w-full bg-gray-700 py-4 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
}
