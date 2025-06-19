"use client";
import React from "react";
import Spinner from "react-bootstrap/Spinner";

export default function Loading() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <Spinner variant="warning" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </>
  );
}
