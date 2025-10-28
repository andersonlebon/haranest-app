"use client";
import Link from "next/link";
import React from "react";
import Router from "next/router";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <h1 className="text-8xl font-bold text-gray-800 mb-4 animate-bounce">
                404
            </h1>
            <h2 className="text-4xl font-semibold text-gray-700 mb-4">
                Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link 
                href="/" 
                className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
                Back to Home
            </Link>
        </div>
    );

}