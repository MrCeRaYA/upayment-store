import Navbar from "./Navbar";

export function Layout({ children }: { children: JSX.Element }) {
  return (
    <div className="mx-auto max-w-[90%] my-5 max-w-screen-lg">
      <Navbar />
      {children}
    </div>
  );
}
