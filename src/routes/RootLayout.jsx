import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

/** Handles scroll position and #section links for every page. */
export default function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
