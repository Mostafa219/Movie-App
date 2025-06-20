"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./MovieCard.module.css";

import { useFavorites } from "@/app/contexts/FavoritesContext";

const getRatingColor = (score) => {
  if (score >= 70) return "#4CAF50";
  if (score >= 50) return "#FFC107";
  return "#F44336";
};

export default function MovieCard({ movie, useFav = true }) {
  const {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
    vote_count,
    overview,
  } = movie;

  const rating = Math.round(vote_average * 10);
  const ratingColor = getRatingColor(rating);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fetchFavorites } = useFavorites();

  const formattedReleaseDate = release_date
    ? new Date(release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/images/placeholder-movie-poster.png";

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const res = await fetch("/api/favorites/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.exists);
        } else {
          console.error("Failed to check favorite status");
        }
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };
    checkFavoriteStatus();
  }, [id]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    const newState = !isFavorite;

    if (newState) {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            title,
            image: imageUrl,
            rate: vote_average,
            date: release_date,
            numberOfRating: vote_count,
            description: overview,
          }),
        });

        if (res.ok) {
          setIsFavorite(true);
          fetchFavorites();
        } else {
          const data = await res.json();
          console.error(data.message || "Error adding to watchlist");
          setIsFavorite(false);
        }
      } catch (err) {
        console.error("Error adding to favorites:", err);
        setIsFavorite(false);
      }
    } else {
      try {
        const res = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          setIsFavorite(false);
          fetchFavorites();
        } else {
          const data = await res.json();
          console.error(data.message || "Error removing from watchlist");
          setIsFavorite(true);
        }
      } catch (err) {
        console.error("Error removing from favorites:", err);
        setIsFavorite(true);
      }
    }

    setLoading(false);
  };

  return (
    <Link href={`/movie/${id}`} passHref className="text-decoration-none">
      <div className="card h-100 border-0 shadow text-white position-relative movie-card">
        <div className="position-relative overflow-hidden bg-secondary rounded">
          <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={700}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-fit-cover rounded w-100 h-auto"
          />

          <div
            className="position-absolute top-0 end-0 m-2 bg-white bg-opacity-50 rounded-circle d-flex justify-content-center align-items-center overflow-auto"
            style={{ width: "32px", height: "32px", zIndex: 1000 }}
          >
            <span className="text-white lh-1 fw-bold">&#x22EF;</span>
          </div>
        </div>

        <div className="card-body p-3 position-relative pt-5 d-flex flex-column justify-content-between">
          {" "}
          <div
            className={styles.ratingCircle}
            style={{
              backgroundImage: `conic-gradient(${ratingColor} ${rating}%, #4a4a4a ${rating}%)`,
            }}
          >
            <div className={styles.innerCircle}>
              <span className="fs-6 fw-bold text-white">{rating}%</span>
            </div>
          </div>
          <div className="px-1 mb-2">
            {" "}
            <h5 className="card-title fw-bold fs-6 mt-1 mb-1 text-dark lh-sm">
              {title}
            </h5>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-auto px-1">
            <p className="card-text text-secondary mb-0 fs-7">
              {formattedReleaseDate}
            </p>
            {useFav && (
              <div
                className="movie-card-favorite-hover cursor-pointer ms-2"
                onClick={handleFavoriteToggle}
                style={{ zIndex: 150 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "#FFD700" : "none"}
                  stroke={isFavorite ? "#FFD700" : "#d1d5db"}
                  strokeWidth="1.5"
                  className="d-block"
                  style={{ width: "20px", height: "20px" }}
                >
                  <path
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.099 3.75 3 5.835 3 8.25c0 7.219 2.912 11.455 9 16.062 6.088-4.607 9-8.843 9-16.062z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
