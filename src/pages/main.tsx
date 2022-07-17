import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import localforage from "localforage";
import Select, { SingleValue } from "react-select";
import { Circles } from "react-loader-spinner";

import { ProductCard } from "components";
import axios from "utils/axios";

import type ProductModel from "models/product";
import type CategoryModel from "models/category";

export default function Main() {
  const allProducts = useRef<ProductModel[]>([]);

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const renderingFirstTime = useRef(true);
  useEffect(() => {
    (async () => {
      // Fetching Products
      const products = await axios.get("/products");
      setProducts(products.data);

      const cached = await localforage.getItem<CategoryModel[]>("categories");

      // Assigning the refs before the last re-render
      allProducts.current = products.data;
      renderingFirstTime.current = false;

      if (cached) return setCategories(cached);

      const categories = await axios.get("/categories");
      setCategories([{ name: "All", id: "" }, ...categories.data]);

      await localforage.setItem("categories", categories.data);
    })();
  }, []);

  const [searchCriteria, setSearchCriteria] = useState({
    category: "",
    name: "",
  });

  const filter = useCallback(
    (type: "category" | "name", value: string) => {
      const newValues = { ...searchCriteria, [type]: value };
      setSearchCriteria(newValues);

      console.log("Search:", newValues, allProducts.current);

      if (newValues.category == "" && newValues.name == "") {
        return setProducts(allProducts.current);
      }
      setProducts(
        allProducts.current.filter(
          (elm) =>
            elm.name.toLowerCase().includes(newValues.name.toLowerCase()) &&
            (newValues.category == "" || elm.category == newValues.category)
        )
      );
    },
    [searchCriteria]
  );

  const filterItems = useCallback(
    (e: SingleValue<{ value: string; label: string }>) => {
      if (!e) return;

      filter("category", e.value);
    },
    [products, searchCriteria]
  );

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchForItem = useCallback(
    (e) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => filter("name", e.target.value), 230);
    },
    [searchCriteria, products]
  ) as ChangeEventHandler<HTMLInputElement>;

  if (renderingFirstTime.current)
    return (
      <Circles
        wrapperClass="w-full h-screen items-center justify-center"
        color="black"
        width={200}
        height={200}
      />
    );

  return (
    <main>
      <div className="flex flex-col md:flex-row justify-between">
        <input
          onChange={searchForItem}
          minLength={2}
          maxLength={20}
          name="name"
          className="py-2 w-full md:w-2/5 xl:w-1/5 px-2 mb-4 border rounded border-gray-500"
          placeholder="Search for an item here"
          required
        />

        <Select
          onChange={filterItems}
          name="category"
          isLoading={categories.length == 0}
          className="mb-4 w-full md:w-2/5 xl:w-1/5"
          options={categories.map((elm) => ({
            value: elm.id,
            label: elm.name[0].toUpperCase() + elm.name.slice(1).toLowerCase(),
          }))}
        />
      </div>

      {products.length == 0 ? (
        <h1 className="text-3xl text-center">No Items were found!</h1>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((data, index) => (
            <ProductCard key={data.id + index} data={data} />
          ))}
        </ul>
      )}
    </main>
  );
}
