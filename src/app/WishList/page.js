"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import WishCard from "../../components/WishCard/WishCard";
import styles from "./wishlist.module.css";
import { useFavorites } from "@/app/contexts/FavoritesContext";

export default function WishListPage() {
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();
  const { fetchFavorites } = useFavorites();

  function goToHome() {
    router.push("/");
  }

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/favorites", {
        cache: "no-store",
      });
      const data = await res.json();
      console.log(data);

      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setWishlist((prev) => prev.filter((item) => item.id !== id));
      fetchFavorites();
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };
  return (
    <div className="container py-5">
      <h2 className="fw-600  mb-4">Watch List</h2>

      {wishlist.length > 0 ? (
        <div className={styles.grid}>
          {wishlist.map((item) => (
            <WishCard
              key={item.id}
              id={item.id}
              title={item.title}
              poster={item.image}
              date={item.date}
              rating={Math.round(item.rate / 2)}
              voteCount={item.numberOfRating}
              description={item.description}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noMoviescontent}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="212"
            height="212"
            viewBox="0 0 212 212"
            fill="none"
          >
            <path
              d="M204.253 73.2113C204.253 84.9256 202.382 95.7544 199.134 105.795C183.58 155.015 135.64 184.449 111.916 192.521C108.569 193.702 103.056 193.702 99.7094 192.521C93.4092 190.355 85.4351 186.713 76.8708 181.594C71.3582 178.346 70.4722 170.667 75.0004 166.139L186.041 55.0983C191.357 49.7826 200.709 52.0467 202.579 59.3312C203.662 63.761 204.253 68.3877 204.253 73.2113Z"
              fill="#D1D1D1"
            />
            <path
              d="M209.456 2.14107C206.601 -0.71369 201.876 -0.71369 199.021 2.14107L175.987 25.176C168.21 20.7462 159.153 18.1868 149.506 18.1868C131.689 18.1868 115.741 26.8495 105.799 40.1389C95.8564 26.8495 79.9086 18.1868 62.091 18.1868C31.8699 18.1868 7.35839 42.7968 7.35839 73.2147C7.35839 84.9291 9.22874 95.7574 12.4773 105.798C18.8759 126.175 30.8855 143.205 44.4703 156.692L2.14107 199.021C-0.71369 201.876 -0.71369 206.601 2.14107 209.456C3.61767 210.932 5.48803 211.621 7.35839 211.621C9.22874 211.621 11.0991 210.932 12.5757 209.456L209.456 12.5757C212.311 9.72094 212.311 4.99583 209.456 2.14107Z"
              fill="#D1D1D1"
            />
          </svg>
          <p className={styles.noMovies}>No Movies in watch list</p>
          <button className={styles.btnBack} onClick={() => goToHome()}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
